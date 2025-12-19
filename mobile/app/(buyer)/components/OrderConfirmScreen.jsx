import { useUser } from '@clerk/clerk-expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../constants/api';
import { buyerStyles, orderConfirmStyles } from '../_styles/BuyerStyles';

const API_BASE_URL = API_URL;

// Hàm helper để tạo order (giữ nguyên)
const createOrder = async (orderData, customerId) => {
  try {
    // Loop qua items để lấy tất cả cart.id, unique bằng Set
    const cartIdsSet = new Set();
    (orderData.items || []).forEach(item => {
      if (item.cart?.id) {
        cartIdsSet.add(item.cart.id);
      }
    });
    const cartIdsArray = Array.from(cartIdsSet); // Chuyển thành mảng

    // console.log("cartIdsArray: ", cartIdsArray);

    const payload = {
      order_date: new Date().toISOString(),
      payment_id: orderData.payment?.id || null,
      customer_id: customerId || null,
      shipment_id: orderData.shipment?.id || null,
      cart_id: cartIdsArray.length > 0 ? cartIdsArray : null, // Truyền mảng hoặc null
    };

    // Debug: Uncomment để log payload
    // console.log("Debug createOrder - payload cart_id (mảng):", payload.cart_id);

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

// Hàm helper để tạo orderItems (CẬP NHẬT: Thêm variant_id vào payload để sync với order_status nếu cần)
const createOrderItems = async (orderId, Data) => {
  // console.log("Debug createOrderItems - orderId:", orderId);
  // console.log("Debug createOrderItems - Data length:", Data);
  try {
    const createdItems = [];
    for (const [index, item] of (Data || []).entries()) {
      const payload = {
        quantity: item.cart?.quantity || 0,  // Nguồn dữ liệu quantity từ cart
        price: item.variant?.price || 0,  // Dùng variant.price
        order_id: orderId,
        product_id: item.product?.id || null,
        variant_id: item.variant?.id || null,  // CẬP NHẬT: Thêm variant_id để unique nếu backend cần
      };

      // console.log(`Debug createOrderItems - payload cho item ${index}:`, payload);  // Log để debug quantity và variant_id

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
    // console.log('Debug createOrderItems - createdItems:', createdItems);
    return createdItems;
  } catch (error) {
    // console.error('Debug createOrderItems - caught error:', error);
    throw new Error(`Lỗi tạo order items: ${error.message}`);
  }
};

// Hàm helper để tạo order_status cho từng product trong order (CẬP NHẬT: Thêm variant_id vào payload để unique theo variant)
const createOrderStatus = async (orderId, items, buyerId) => {
  // console.log("Debug createOrderStatus - orderId:", orderId);
  // console.log("Debug createOrderStatus - items length:", items?.length);
  // console.log("Debug createOrderStatus - buyerId:", buyerId);
  try {
    const createdStatuses = [];
    
    // Trích xuất tất cả product_id và seller_id để debug/log (CẬP NHẬT: Thêm variant_id)
    const allProductIds = [];
    const allVariantIds = [];  // THÊM: Để debug variant_id
    const allSellerIds = [];
    (items || []).forEach((item, index) => {
      if (item.product?.id) allProductIds.push(item.product.id);
      if (item.variant?.id) allVariantIds.push(item.variant.id);  // THÊM: Log variant_id
      if (item.product?.customer_id) allSellerIds.push(item.product.customer_id);
      // console.log(`Debug createOrderStatus - Item ${index}: product_id=${item.product?.id}, variant_id=${item.variant?.id}, seller_id=${item.product?.customer_id}, quantity từ cart=${item.cart?.quantity}`);
    });
    // console.log("Debug createOrderStatus - All product_ids:", allProductIds);
    // console.log("Debug createOrderStatus - All variant_ids:", allVariantIds);  // THÊM: Log để verify unique
    // console.log("Debug createOrderStatus - All seller_ids:", allSellerIds);

    for (const [index, item] of (items || []).entries()) {
      // Dùng CÙNG NGUỒN DỮ LIỆU như order_item: item.cart?.quantity, item.product?.id, item.variant?.id, item.product.customer_id
      const payload = {
        seller_id: item.product?.customer_id || null,  // Từ product.customer_id (seller)
        buyer_id: buyerId,
        product_id: item.product?.id,  // Cùng product_id như order_item
        variant_id: item.variant?.id || null,  // CẬP NHẬT: Thêm variant_id để unique theo variant (tránh duplicate)
        quantity: item.cart?.quantity || 0,  // CÙNG quantity từ cart như order_item (sync 100%)
        order_id: orderId,
        status: 'pending', // Status mặc định cho order mới
        current_location: null,  // Default nếu cần
      };

      // console.log(`Debug createOrderStatus - payload cho item ${index}:`, payload);  // Log để debug variant_id và quantity

      const response = await fetch(`${API_BASE_URL}/order_status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // console.log(`Debug createOrderStatus - response status cho item ${index}:`, response.status);
      if (!response.ok) {
        const errorText = await response.text();
        // console.error(`Debug createOrderStatus - full error response cho item ${index}:`, errorText);
        throw new Error(`Failed to create order status ${index}: ${response.status} - ${errorText}`);
      }

      const newStatus = await response.json();
      createdStatuses.push(newStatus);
    }
    // console.log('Debug createOrderStatus - createdStatuses:', createdStatuses);
    return createdStatuses;
  } catch (error) {
    // console.error('Debug createOrderStatus - caught error:', error);
    throw new Error(`Lỗi tạo order status: ${error.message}`);
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
  const currentCustomerId = passedData?.customerId || fallbackCustomerId;

  // Effect để tạo order và orderItems khi component mount (giữ nguyên: Tách riêng, gọi orderItems trước, status sau)
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

        // Bước 2: Tạo orderItems với order_id mới (dùng variant.price và cart.quantity)
        const newItems = await createOrderItems(newOrder.id, passedData.items);
        // console.log('Debug OrderConfirm - New order items created:', newItems);

        // Bước 3: Tạo order_status cho từng product (dùng CÙNG passedData.items để sync quantity với order_item)
        const newStatuses = await createOrderStatus(newOrder.id, passedData.items, currentCustomerId);
        // console.log('Debug OrderConfirm - New order statuses created:', newStatuses);

        // Validate sync: Kiểm tra số lượng items và statuses khớp (tránh chênh lệch)
        if (newItems.length !== passedData.items.length || newStatuses.length !== passedData.items.length) {
          throw new Error('Chênh lệch số lượng items và statuses - vui lòng kiểm tra lại!');
        }

        // Bước 4: Chuẩn bị dữ liệu hiển thị (CẬP NHẬT: Match theo index để đảm bảo đúng originalItem)
        const fullOrderData = {
          id: newOrder.id,
          date: newOrder.order_date || new Date().toISOString(),
          items: newItems.map((item, index) => {
            // Sử dụng index để match trực tiếp với passedData.items (thứ tự giữ nguyên)
            const originalItem = passedData.items && passedData.items.length > index 
              ? passedData.items[index] 
              : null;
            return {
              ...item,
              product: originalItem?.product || { name: 'Sản phẩm không xác định' }, // Fallback nếu không tìm thấy
              variant: originalItem?.variant || {},  // Thêm variant để hiển thị size/color
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
            <TouchableOpacity onPress={() => navigation.navigate('(buyer)/index')} style={orderConfirmStyles.emptyButton}>
              <Text style={orderConfirmStyles.emptyButtonText}>Về giỏ hàng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const { id, date, items, shipment, payment, total } = orderData;

  const handleTrackOrder = () => {
    // console.log("currentCustomerId: ", currentCustomerId);
    if (!currentCustomerId || !id) {
      Alert.alert('Lỗi', 'Không thể theo dõi vì thiếu thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }
    // Truyền buyerId (currentCustomerId) sang OrderTrackingScreen
    navigation.navigate('(buyer)/components/OrderTrackingScreen', { 
      buyerId: currentCustomerId,
      orderId: id
    });
  };

  const handleBackToHome = () => {
    navigation.navigate('(home)/index');
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

          {/* Order Items - SỬA: Hiển thị size/color từ variant */}
          <View style={orderConfirmStyles.section}>
            <Text style={orderConfirmStyles.title}>Sản phẩm</Text>
            <FlatList
              data={items}
              renderItem={({ item }) => (
                <View style={orderConfirmStyles.orderItem}>
                  <Text style={orderConfirmStyles.itemName}>{item.product?.name || 'Sản phẩm'}</Text>
                  <View style={orderConfirmStyles.itemDetails}>
                    <Text>Số lượng: {item.quantity || 0}</Text>
                    <Text>Kích cỡ: {item.variant?.size || 'N/A'} | Màu: {item.variant?.color || 'N/A'}</Text>
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

          {/* Shipment Info - SỬA: Hiển thị address, city từ shipment */}
          <View style={orderConfirmStyles.section}>
            <Text style={orderConfirmStyles.title}>Giao hàng đến</Text>
            <Text style={orderConfirmStyles.info}>
              {`${shipment.address || 'N/A'}, ${shipment.city || 'N/A'}, ${shipment.state || ''}, ${shipment.country || ''} ${shipment.zipcode || ''}`.trim() || 'Chi tiết địa chỉ'}
            </Text>
            <Text style={orderConfirmStyles.info}>Ngày giao dự kiến: {shipment.shipment_date || 'Chưa xác định'}</Text>
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
