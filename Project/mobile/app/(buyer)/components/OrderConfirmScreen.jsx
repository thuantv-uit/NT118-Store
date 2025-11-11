// OrderConfirmScreen.jsx (Cập nhật)
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react'; // Thêm useState và useEffect
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

// Giả sử base URL API (có thể config ở nơi khác)
const API_BASE_URL = API_URL; // Thay bằng URL thực tế của bạn

// Hàm helper để tạo order (dựa trên controllers)
const createOrder = async (orderData) => {
  try {
    console.log("orderData: ", orderData);
    const response = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_date: new Date().toISOString(), // Sử dụng ngày hiện tại
        payment_id: orderData.payment.id || null, // Giả sử payment có id, nếu chưa tạo thì null hoặc tạo trước
        customer_id: orderData.customerId,
        shipment_id: orderData.shipment.id || null, // Tương tự, nếu shipment cần id riêng
        cart_id: orderData.cartItems[0]?.cart?.id || null, // Lấy cart_id từ item đầu
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const newOrder = await response.json();
    return newOrder;
  } catch (error) {
    throw new Error(`Lỗi tạo order: ${error.message}`);
  }
};

// Hàm helper để tạo orderItems (dựa trên controllers)
const createOrderItems = async (orderId, cartItems) => {
  try {
    const createdItems = [];
    for (const item of cartItems) {
      const response = await fetch(`${API_BASE_URL}/order_item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: item.cart?.quantity || 0,
          price: item.product?.price || 0,
          order_id: orderId,
          product_id: item.product?.id || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order item');
      }

      const newItem = await response.json();
      createdItems.push(newItem);
    }
    return createdItems;
  } catch (error) {
    throw new Error(`Lỗi tạo order items: ${error.message}`);
  }
};

export default function OrderConfirmScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderData: passedData } = route.params || {}; // Nhận dữ liệu từ Checkout
  const [orderData, setOrderData] = useState(null); // State để lưu order sau khi tạo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("passedData:", passedData);

  // Effect để tạo order và orderItems khi component mount
  useEffect(() => {
    if (!passedData) {
      setLoading(false);
      setError('Không tìm thấy dữ liệu đơn hàng!');
      return;
    }

    const createFullOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        // Bước 1: Tạo order
        const newOrder = await createOrder(passedData);
        console.log('New order created:', newOrder);

        // Bước 2: Tạo orderItems với order_id mới
        const newItems = await createOrderItems(newOrder.id, passedData.cartItems);
        console.log('New order items created:', newItems);

        // Bước 3: Chuẩn bị dữ liệu hiển thị
        const fullOrderData = {
          id: newOrder.id,
          date: newOrder.order_date,
          items: newItems.map(item => ({
            ...item,
            product: passedData.cartItems.find(ci => ci.product.id === item.product_id)?.product, // Map lại product info
            cart: passedData.cartItems.find(ci => ci.cart.id === item.cart_id)?.cart, // Nếu cần
          })),
          shipment: passedData.shipment,
          payment: passedData.payment,
          total: passedData.total,
        };

        setOrderData(fullOrderData);
      } catch (err) {
        setError(err.message);
        console.error('Error creating order:', err);
      } finally {
        setLoading(false);
      }
    };

    createFullOrder();
  }, [passedData]);

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
    // TODO: Navigate to TrackOrderScreen or call API track
    Alert.alert('Theo dõi', 'Chuyển đến màn hình theo dõi đơn hàng!');
  };

  const handleBackToHome = () => {
    navigation.navigate('Home'); // Chuyển về Home thay vì goBack để reset stack
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
                    <Text>Số lượng: {item.quantity || 0}</Text> {/* Dùng quantity từ orderItem */}
                    <Text>Đơn giá: {(item.price || 0).toLocaleString('vi-VN')} VNĐ</Text> {/* Dùng price từ orderItem */}
                    <Text style={orderConfirmStyles.subtotal}>
                      Tạm tính: {((item.quantity || 0) * (item.price || 0)).toLocaleString('vi-VN')} VNĐ
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>

          {/* Shipment Info */}
          <View style={orderConfirmStyles.section}>
            <Text style={orderConfirmStyles.title}>Giao hàng đến</Text>
            <Text style={orderConfirmStyles.info}>
              {shipment.address}, {shipment.city}
            </Text>
          </View>

          {/* Payment Info */}
          <View style={orderConfirmStyles.section}>
            <Text style={orderConfirmStyles.title}>Thanh toán</Text>
            <Text style={orderConfirmStyles.info}>
              Phương thức: {payment.method === 'card' ? 'Thẻ tín dụng' : payment.method === 'cash' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}
            </Text>
            <Text style={orderConfirmStyles.info}>Tổng tiền: {total.toLocaleString('vi-VN')} VNĐ</Text>
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={orderConfirmStyles.actions}>
          <TouchableOpacity style={orderConfirmStyles.button} onPress={handleTrackOrder}>
            <Text style={orderConfirmStyles.buttonText}>Theo dõi đơn hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={orderConfirmStyles.buttonSecondary} 
            onPress={handleBackToHome}
            >
            <Text style={orderConfirmStyles.buttonTextSecondary}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}