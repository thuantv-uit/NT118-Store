// useCheckout.js
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '../../../constants/api';

const API_BASE_URL = API_URL;

export const useCheckout = (cartTotal, customerIdFromProp) => { // Đổi tên prop để rõ
  const [shipmentData, setShipmentData] = useState({
    shipment_date: new Date().toISOString(),
    address_id: '', // Thay đổi: Chỉ cần address_id thay vì các trường địa chỉ chi tiết
  });
  const [paymentData, setPaymentData] = useState({
    payment_method: 'card', // Consistent với option.key
    amount: cartTotal,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { user } = useUser(); // Lấy trực tiếp để fallback, tránh null từ prop

  // Fallback customerId: Ưu tiên prop, rồi user.id
  const currentCustomerId = customerIdFromProp || user?.id;
  // console.log("Debug - currentCustomerId:", currentCustomerId); // Log để check null
  // console.log("Debug - user?.id:", user?.id);
  // console.log("Debug - customerIdFromProp:", customerIdFromProp);

  // Effect update amount reactive (giữ nguyên)
  useEffect(() => {
    setPaymentData(prev => ({ ...prev, amount: cartTotal }));
    // console.log('Updated payment amount:', cartTotal);
  }, [cartTotal]);

  const handleShipmentChange = (field, value) => {
    setShipmentData({ ...shipmentData, [field]: value });
    setError(null);
  };

  const handlePaymentChange = (method) => {
    setPaymentData(prev => ({ ...prev, payment_method: method }));
    setError(null);
  };

  const createShipment = async () => {
    if (!currentCustomerId) {
      throw new Error('User ID không hợp lệ, không thể tạo shipment');
    }
    const payload = {
      ...shipmentData,
      customer_id: currentCustomerId, // Đảm bảo truyền
    };
    // console.log('Sending shipment payload:', payload);

    try {
      const response = await axios.post(`${API_BASE_URL}/shipment`, payload);
      // console.log('Shipment created:', response.data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error creating shipment:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Lỗi tạo thông tin giao hàng');
    }
  };

  const createPayment = async () => {
    if (!currentCustomerId) {
      throw new Error('User ID không hợp lệ, không thể tạo payment');
    }
    const payload = {
      payment_date: new Date().toISOString(),
      payment_method: paymentData.payment_method,
      amount: paymentData.amount,
      customer_id: currentCustomerId, // Đảm bảo truyền
    };
    // console.log('Sending payment payload:', payload);

    if (!payload.payment_date || !payload.payment_method || !payload.amount) {
      throw new Error('Thiếu thông tin thanh toán');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/payment`, payload);
      // console.log('Payment created:', response.data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error creating payment:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Lỗi tạo thanh toán');
    }
  };

  const handleCheckout = async (cartItems) => {  // SỬA: Nhận cartItems để pass sang OrderConfirm
    if (!currentCustomerId) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để thanh toán!');
      return;
    }

    // Validate shipment - Thay đổi: Chỉ check address_id
    const requiredFields = ['address_id'];
    const missing = requiredFields.find(field => !shipmentData[field]);
    if (missing) {
      Alert.alert('Lỗi', `Vui lòng chọn địa chỉ giao hàng!`);
      return;
    }

    if (cartTotal <= 0 || cartItems.length === 0) {
      Alert.alert('Lỗi', 'Giỏ hàng trống hoặc tổng tiền không hợp lệ!');
      return;
    }

    if (paymentData.amount !== cartTotal) {
      console.warn('Amount mismatch:', { paymentAmount: paymentData.amount, cartTotal });
      Alert.alert('Lỗi', 'Tổng tiền không khớp, vui lòng thử lại!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const shipmentResult = await createShipment();
      const shipmentId = shipmentResult.data.id;

      const paymentResult = await createPayment();
      const paymentId = paymentResult.data.id;

      // console.log('Checkout success with IDs:', { shipmentId, paymentId });

      // Navigate với data đầy đủ (SỬA: Pass cartItems với { cart, product, variant })
      navigation.navigate('(buyer)/components/OrderConfirmScreen', {
        orderData: {
          // id: `ORD-${Date.now()}`,
          date: new Date().toISOString(),
          items: cartItems,  // SỬA: Pass full cartItems
          shipment: { ...shipmentData, id: shipmentId },
          payment: { ...paymentData, id: paymentId },
          total: cartTotal,
        },
      });

      Alert.alert('Thành công', 'Đã tạo thông tin thanh toán và giao hàng!');
    } catch (err) {
      setError(err.message);
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    shipmentData,
    paymentData,
    onShipmentChange: handleShipmentChange,
    onPaymentChange: handlePaymentChange,
    handleCheckout,
    loading,
    error,
    currentCustomerId, // Export để screen check
  };
};
