import { useUser } from '@clerk/clerk-expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../constants/api';
import { buyerStyles, orderConfirmStyles } from '../styles/BuyerStyles';

const API_BASE_URL = API_URL;

// Hàm helper để tạo order (thêm debug logs và đảm bảo fields là null nếu undefined)
const createOrder = async (orderData, customerId) => {
  try {
    const payload = {
      order_date: new Date().toISOString(),
      payment_id: orderData.payment?.id || null,
      customer_id: customerId || null,
      shipment_id: orderData.shipment?.id || null,
      cart_id: orderData.items[0].cart.id || null,
    };

    const response = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // console.log("Debug createOrder - response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      // console.error("Debug createOrder - full error response:", errorText);
      throw new Error(`Failed to create order: ${response.status} - ${errorText}`);
    }

    const newOrder = await response.json();
    // console.log('Debug createOrder - newOrder created:', newOrder);
    return newOrder;
  } catch (error) {
    // console.error('Debug createOrder - caught error:', error);
    throw new Error(`Lỗi tạo order: ${error.message}`);
  }
};

// Hàm helper để tạo orderItems (thêm debug logs)
const createOrderItems = async (orderId, Data) => {
  // console.log("Debug createOrderItems - orderId:", orderId);
  // console.log("Debug createOrderItems - Data length:", Data);
  try {
    const createdItems = [];
    for (const [index, item] of (Data || []).entries()) {
      const payload = {
        quantity: item.cart?.quantity || 0,
        price: item.product?.price || 0,
        order_id: orderId,
        product_id: item.product?.id || null,
      };

      const response = await fetch(`${API_BASE_URL}/order_item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // console.log(`Debug createOrderItems - response status cho item ${index}:`, response.status);
      if (!response.ok) {
        const errorText = await response.text();
        // console.error(`Debug createOrderItems - full error response cho item ${index}:`, errorText);
        throw new Error(`Failed to create order item ${index}: ${response.status} - ${errorText}`);
      }

      const newItem = await response.json();
      createdItems.push(newItem);
    }
    return createdItems;
  } catch (error) {
    // console.error('Debug createOrderItems - caught error:', error);
    throw new Error(`Lỗi tạo order items: ${error.message}`);
  }
};

export default function OrderConfirmScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useUser();
  const fallbackCustomerId = user?.id;
  const { orderData: passedData } = route.params || {};
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const carts = passedData.items.map(item => item.cart.product_id);
  // console.log("Debug OrderConfirm - passedData - items.id:", carts);
  // console.log("Debug OrderConfirm - passedData - items:", passedData.items);
  // console.log("Debug OrderConfirm - passedData - items:", passedData.payment);
  // console.log("Debug OrderConfirm - passedData - shipment:", passedData.shipment);
  // console.log("Debug OrderConfirm - passedData:", passedData);
  // console.log("Debug OrderConfirm - fallbackCustomerId from user:", fallbackCustomerId);

  // Effect để tạo order và orderItems khi component mount
  useEffect(() => {
    if (!passedData) {
      setLoading(false);
      setError('Không tìm thấy dữ liệu đơn hàng!');
      return;
    }

    // Validate customerId: Ưu tiên từ passedData, fallback user.id, nếu vẫn undefined thì error
    const currentCustomerId = passedData.customerId || fallbackCustomerId;
    // console.log("Debug OrderConfirm - currentCustomerId:", currentCustomerId);
    if (!currentCustomerId) {
      setLoading(false);
      setError('Không tìm thấy thông tin khách hàng! Vui lòng đăng nhập lại.');
      return;
    }

    // Validate các field cần thiết khác
    if (!passedData.items || passedData.items.length === 0) {
      setLoading(false);
      setError('Giỏ hàng trống!');
      return;
    }
    const createFullOrder = async () => {
      try {
        // console.log('Debug OrderConfirm - Bắt đầu tạo full order...');
        setLoading(true);
        setError(null);

        // Bước 1: Tạo order - Truyền currentCustomerId
        const newOrder = await createOrder(passedData, currentCustomerId);
        // console.log('Debug OrderConfirm - New order created:', newOrder);

        // Bước 2: Tạo orderItems với order_id mới
        const newItems = await createOrderItems(newOrder.id, passedData.items);
        // console.log('Debug OrderConfirm - New order items created:', newItems);

        // Bước 3: Chuẩn bị dữ liệu hiển thị (sửa lỗi find undefined bằng cách kiểm tra passedData.items)
        const fullOrderData = {
          id: newOrder.id,
          date: newOrder.order_date || new Date().toISOString(),
          items: newItems.map(item => {
            // Tìm original item từ passedData.items dựa trên product_id (kiểm tra tồn tại trước)
            const originalItem = passedData.items && passedData.items.length > 0 
              ? passedData.items.find(orig => orig.product?.id === item.product_id) 
              : null;
            return {
              ...item,
              product: originalItem?.product || { name: 'Sản phẩm không xác định' }, // Fallback nếu không tìm thấy
            };
          }),
          shipment: passedData.shipment || {},
          payment: passedData.payment || {},
          total: passedData.total || 0,
        };
        // console.log('Debug OrderConfirm - fullOrderData prepared:', fullOrderData);
        setOrderData(fullOrderData);
      } catch (err) {
        // console.error('Debug OrderConfirm - Error creating full order:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    createFullOrder();
  }, [passedData, fallbackCustomerId]);

  if (loading) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#6D4C41" />
            </TouchableOpacity>
            <Text style={buyerStyles.headerTitle}>Xác nhận đơn hàng</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#6D4C41" />
            <Text style={{ marginTop: 10 }}>Đang tạo đơn hàng...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !orderData) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#6D4C41" />
            </TouchableOpacity>
            <Text style={buyerStyles.headerTitle}>Xác nhận đơn hàng</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={orderConfirmStyles.emptySection}>
            <Text style={orderConfirmStyles.emptyText}>Lỗi: {error || 'Không tìm thấy đơn hàng!'}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={orderConfirmStyles.emptyButton}>
              <Text style={orderConfirmStyles.emptyButtonText}>Về giỏ hàng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const { id, date, items, shipment, payment, total } = orderData;

  const handleTrackOrder = () => {
    Alert.alert('Theo dõi', 'Chuyển đến màn hình theo dõi đơn hàng!');
  };

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={buyerStyles.safe}>
      <View style={buyerStyles.container}>
        <View style={buyerStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#6D4C41" />
          </TouchableOpacity>
          <Text style={buyerStyles.headerTitle}>Xác nhận đơn hàng</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Order Info */}
          <View style={orderConfirmStyles.section}>
            <Text style={orderConfirmStyles.title}>Đơn hàng #{id}</Text>
            <Text style={orderConfirmStyles.info}>Ngày đặt: {new Date(date).toLocaleDateString('vi-VN')}</Text>
          </View>

          {/* Order Items */}
          <View style={orderConfirmStyles.section}>
            <Text style={orderConfirmStyles.title}>Sản phẩm</Text>
            <FlatList
              data={items}
              renderItem={({ item }) => (
                <View style={orderConfirmStyles.orderItem}>
                  <Text style={orderConfirmStyles.itemName}>{item.product?.name || 'Sản phẩm'}</Text>
                  <View style={orderConfirmStyles.itemDetails}>
                    <Text>Số lượng: {item.quantity || 0}</Text>
                    <Text>Đơn giá: {(item.price || 0).toLocaleString('vi-VN')} VNĐ</Text>
                    <Text style={orderConfirmStyles.subtotal}>
                      Tạm tính: {((item.quantity || 0) * (item.price || 0)).toLocaleString('vi-VN')} VNĐ
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // Fallback key nếu id undefined
              scrollEnabled={false}
            />
          </View>

          {/* Shipment Info */}
          <View style={orderConfirmStyles.section}>
            <Text style={orderConfirmStyles.title}>Giao hàng đến</Text>
            <Text style={orderConfirmStyles.info}>
              {/* {shipment.address || 'N/A'}, {shipment.city || 'N/A'} */}
              {shipment.shipment_date || 'N/A'}
            </Text>
          </View>

          {/* Payment Info - Chỉ hỗ trợ 2 phương thức: ví và COD */}
          <View style={orderConfirmStyles.section}>
            <Text style={orderConfirmStyles.title}>Thanh toán</Text>
            <Text style={orderConfirmStyles.info}>
              Phương thức: {payment.payment_method === 'wallet' ? 'Thanh toán bằng ví' : 
                           (payment.payment_method === 'cash' ? 'Thanh toán khi nhận hàng' : 'Chưa xác định')}
            </Text>
            <Text style={orderConfirmStyles.info}>Tổng tiền: {total.toLocaleString('vi-VN')} VNĐ</Text>
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={orderConfirmStyles.actions}>
          <TouchableOpacity style={orderConfirmStyles.button} onPress={handleTrackOrder}>
            <Text style={orderConfirmStyles.buttonText}>Theo dõi đơn hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={orderConfirmStyles.buttonSecondary} onPress={handleBackToHome}>
            <Text style={orderConfirmStyles.buttonTextSecondary}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}