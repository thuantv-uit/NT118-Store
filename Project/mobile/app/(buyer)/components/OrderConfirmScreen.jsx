import { useNavigation, useRoute } from '@react-navigation/native';
import {
    Alert,
    FlatList,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { buyerStyles, orderConfirmStyles } from '../styles/BuyerStyles';

export default function OrderConfirmScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderData } = route.params || {}; // Receive data from Checkout
  console.log("orderData:", orderData);

  if (!orderData) {
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
            <Text style={orderConfirmStyles.emptyText}>Không tìm thấy đơn hàng!</Text>
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
    navigation.navigate('/(home)');
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
                    <Text>Số lượng: {item.cart?.quantity || 0}</Text>
                    <Text>Đơn giá: {(item.product?.price || 0).toLocaleString('vi-VN')} VNĐ</Text>
                    <Text style={orderConfirmStyles.subtotal}>
                      Tạm tính: {((item.cart?.quantity || 0) * (item.product?.price || 0)).toLocaleString('vi-VN')} VNĐ
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={({ cart }) => cart.id.toString()}
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
            // onPress={handleBackToHome}
            >
            <Text style={orderConfirmStyles.buttonTextSecondary}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}