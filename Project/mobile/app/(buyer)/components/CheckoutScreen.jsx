import { useUser } from '@clerk/clerk-expo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../hook/useCart';
import { useCheckout } from '../hook/useCheckout'; // Import hook mới
import { buyerStyles, checkoutStyles } from '../styles/BuyerStyles';

export default function CheckoutScreen() {
  const { user } = useUser();
  const customerId = user?.id;
  const { cartItems, total } = useCart(customerId);
  const navigation = useNavigation();

  // Sử dụng hook thay vì local state
  const {
    shipmentData,
    paymentData,
    onShipmentChange,
    onPaymentChange,
    handleCheckout,
    loading,
    error,
    currentCustomerId,
  } = useCheckout(total, customerId);

  const handleBack = () => {
    navigation.goBack();
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={handleBack}>
              <Icon name="arrow-back" size={24} color="#6D4C41" />
            </TouchableOpacity>
            <Text style={buyerStyles.headerTitle}>Thanh toán</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={checkoutStyles.emptySection}>
            <Text style={checkoutStyles.emptyText}>Giỏ hàng trống. Vui lòng thêm sản phẩm!</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={checkoutStyles.emptyButton}>
              <Text style={checkoutStyles.emptyButtonText}>Về trang chủ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Error state từ hook
  if (error) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={handleBack}>
              <Icon name="arrow-back" size={24} color="#6D4C41" />
            </TouchableOpacity>
            <Text style={buyerStyles.headerTitle}>Thanh toán</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>Lỗi: {error}</Text>
            <TouchableOpacity onPress={() => window.location.reload()} style={checkoutStyles.emptyButton}>
              <Text style={checkoutStyles.emptyButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={buyerStyles.safe}>
      <View style={buyerStyles.container}>
        <View style={buyerStyles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Icon name="arrow-back" size={24} color="#6D4C41" />
          </TouchableOpacity>
          <Text style={buyerStyles.headerTitle}>Thanh toán</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Shipment Form - dùng state từ hook */}
          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>Thông tin giao hàng</Text>
            <TextInput
              style={checkoutStyles.input}
              placeholder="Địa chỉ giao hàng"
              value={shipmentData.address}
              onChangeText={(value) => onShipmentChange('address', value)}
            />
            <TextInput
              style={checkoutStyles.input}
              placeholder="Thành phố"
              value={shipmentData.city}
              onChangeText={(value) => onShipmentChange('city', value)}
            />
            <TextInput
              style={checkoutStyles.input}
              placeholder="Tỉnh/Thành"
              value={shipmentData.state}
              onChangeText={(value) => onShipmentChange('state', value)}
            />
            <TextInput
              style={checkoutStyles.input}
              placeholder="Quốc gia"
              value={shipmentData.country}
              onChangeText={(value) => onShipmentChange('country', value)}
            />
            <TextInput
              style={checkoutStyles.input}
              placeholder="Mã bưu điện"
              value={shipmentData.zipcode}
              onChangeText={(value) => onShipmentChange('zipcode', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Payment Form - dùng state từ hook */}
          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>Phương thức thanh toán</Text>
            {checkoutStyles.paymentOptions.map((option) => {
            const isSelected = paymentData.method === option.key;
            return (
                <TouchableOpacity
                key={option.key}
                style={[
                    checkoutStyles.option,
                    isSelected && checkoutStyles.selectedOption,
                ]}
                onPress={() => onPaymentChange(option.key)}
                activeOpacity={0.8}
                >
                <View style={checkoutStyles.optionLeft}>
                    <MaterialCommunityIcons
                    name={option.icon}
                    size={26}
                    color={isSelected ? '#fff' : '#6D4C41'}
                    />
                    <Text
                    style={[
                        checkoutStyles.optionText,
                        isSelected && { color: '#fff', fontWeight: '600' },
                    ]}
                    >
                    {option.label}
                    </Text>
                </View>
                {isSelected && (
                    <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color="#fff"
                    />
                )}
                </TouchableOpacity>
            );
            })}
          </View>

          {/* Cart Items List */}
          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>Giỏ hàng của bạn ({cartItems.length} sản phẩm)</Text>
            <FlatList
              data={cartItems}
              renderItem={({ item }) => (
                <View style={checkoutStyles.orderItem}>
                  <Text style={checkoutStyles.itemName}>{item.product?.name || 'Sản phẩm'}</Text>
                  <View style={checkoutStyles.itemDetails}>
                    <Text>Số lượng: {item.cart?.quantity || 0}</Text>
                    <Text>Đơn giá: {(item.product?.price || 0).toLocaleString('vi-VN')} VNĐ</Text>
                    <Text style={checkoutStyles.subtotal}>
                      Tạm tính: {((item.cart?.quantity || 0) * (item.product?.price || 0)).toLocaleString('vi-VN')} VNĐ
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={({ cart }) => cart.id.toString()}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>

        {/* Cart Summary - dùng handleCheckout từ hook */}
        <View style={checkoutStyles.summary}>
          <Text style={checkoutStyles.totalText}>Tổng cộng: {total.toLocaleString('vi-VN')} VNĐ</Text>
          <TouchableOpacity 
            style={[checkoutStyles.button, loading && { opacity: 0.7 }]} 
            onPress={() => handleCheckout(cartItems)}
            disabled={loading || !currentCustomerId}
          >
            <Text style={checkoutStyles.buttonText}>
              {loading ? 'Đang xử lý...' : 'Xác nhận đơn hàng'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}