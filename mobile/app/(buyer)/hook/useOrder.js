import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '../../../constants/api';

const API_BASE = API_URL;

export const useOrder = ({ shipment_id, payment_id, shipmentData, paymentData, cartItems, customerId, total }) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  const createOrder = useCallback(async () => {
    if (!shipment_id || !payment_id || !cartItems || !customerId) {
      setError('Dữ liệu không đầy đủ!');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = await getToken();

      // Bước 1: Tạo order (dùng ids sẵn)
      const orderDate = new Date().toISOString();
      const orderRes = await fetch(`${API_BASE}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_date: orderDate,
          payment_id,
          customer_id: customerId,
          shipment_id,
          total_price: total,
        }),
      });
      if (!orderRes.ok) throw new Error('Tạo đơn hàng thất bại');
      const order = await orderRes.json();

      // Bước 2: Tạo order_items (SỬA: Thêm variant_id nếu có)
      const items = [];
      for (const item of cartItems) {
        // SỬA: Dùng variant.price nếu có, fallback product.price
        const itemPrice = item.variant?.price || item.product?.price || 0;
        const orderItemRes = await fetch(`${API_BASE}/order_item`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: item.cart?.quantity || 0,
            price: itemPrice,
            order_id: order.id,
            product_id: item.product?.id,
            variant_id: item.variant?.id || null,  // SỬA: Thêm variant_id
          }),
        });
        if (!orderItemRes.ok) throw new Error(`Tạo item thất bại: ${item.product?.name}`);
        const orderItem = await orderItemRes.json();
        items.push({ ...orderItem, product: item.product, cart: item.cart, variant: item.variant });
      }

      // Set orderData
      setOrderData({
        id: order.id,
        date: orderDate,
        items,
        shipment: shipmentData, // Dùng raw data cho display
        payment: paymentData,
        total,
      });

      // Optional: Clear cart sau success
      // await fetch(`${API_BASE}/carts/${customerId}/clear`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });

      Alert.alert('Thành công!', 'Đơn hàng đã được tạo!');
    } catch (err) {
      setError(err.message);
      Alert.alert('Lỗi!', err.message || 'Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [shipment_id, payment_id, shipmentData, paymentData, cartItems, customerId, total, getToken]);

  return { orderData, loading, error, createOrder };
};