// hooks/useCheckout.js (cập nhật để fix amount reactive và debug)
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '../../../constants/api';

const API_BASE_URL = API_URL;

export const useCheckout = (cartTotal, customerId) => {
  const [shipmentData, setShipmentData] = useState({
    shipment_date: new Date().toISOString(),
    address: '',
    city: '',
    state: '',
    country: 'Việt Nam',
    zipcode: '',
  });
  const [paymentData, setPaymentData] = useState({
    payment_method: 'card',
    amount: cartTotal, // Init với total
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { user } = useUser();

  const currentCustomerId = customerId || user?.id;

  // Effect để update amount khi cartTotal thay đổi (reactive)
  useEffect(() => {
    setPaymentData(prev => ({ ...prev, amount: cartTotal }));
    console.log('Updated payment amount:', cartTotal); // Debug log
  }, [cartTotal]);

  const handleShipmentChange = (field, value) => {
    setShipmentData({ ...shipmentData, [field]: value });
    setError(null);
  };

  const handlePaymentChange = (method) => {
    setPaymentData(prev => ({ ...prev, payment_method: method })); // Đổi method → payment_method cho consistent
    setError(null);
  };

  const createShipment = async () => {
    const payload = {
      ...shipmentData,
      customer_id: currentCustomerId,
    };
    console.log('Sending shipment payload:', payload); // Debug: Log trước khi gửi

    try {
      const response = await axios.post(`${API_BASE_URL}/shipment`, payload);
      console.log('Shipment created:', response.data); // Debug success
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error creating shipment:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Lỗi tạo thông tin giao hàng');
    }
  };

  const createPayment = async () => {
    const payload = {
      payment_date: new Date().toISOString(),
      payment_method: paymentData.payment_method,
      amount: paymentData.amount,
      customer_id: currentCustomerId,
    };
    console.log('Sending payment payload:', payload); // Debug: Log chi tiết trước gửi

    // Check local trước gửi (mimic backend validation)
    if (!payload.payment_date || !payload.payment_method || !payload.amount) {
      throw new Error('Thiếu thông tin thanh toán: payment_date, payment_method, hoặc amount');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/payment`, payload);
      console.log('Payment created:', response.data); // Debug success
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error creating payment:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Lỗi tạo thanh toán');
    }
  };

  const handleCheckout = async (cartItems) => {
    if (!currentCustomerId) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để thanh toán!');
      return;
    }

    // Validate shipment
    const requiredFields = ['address', 'city', 'state', 'country', 'zipcode'];
    const missing = requiredFields.find(field => !shipmentData[field]);
    if (missing) {
      Alert.alert('Lỗi', `Vui lòng điền đầy đủ thông tin giao hàng (${missing})!`);
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

      // TODO: Tạo order với IDs này
      console.log('Checkout success with IDs:', { shipmentId, paymentId });

      navigation.navigate('(buyer)/components/OrderConfirmScreen', {
        orderData: {
          id: `ORD-${Date.now()}`,
          date: new Date().toISOString(),
          items: cartItems,
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
    currentCustomerId,
  };
};