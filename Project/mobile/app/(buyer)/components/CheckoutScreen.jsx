// CheckoutScreen.jsx (Cập nhật: Tạo shipment và payment ở đây, lấy ID rồi truyền xuống OrderConfirm)
import { useUser } from '@clerk/clerk-expo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react'; // Thêm useState cho local form (thay hook nếu cần, hoặc giữ hook cho state)
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../constants/api';
import { useCart } from '../hook/useCart';
import { useCheckout } from '../hook/useCheckout';
import { buyerStyles, checkoutStyles } from '../styles/BuyerStyles';

// Giả sử base URL API (có thể config ở nơi khác)
const API_BASE_URL = API_URL; // Thay bằng URL thực tế của bạn

// Hàm helper để tạo shipment
const createShipment = async (shipmentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: shipmentData.address,
        city: shipmentData.city,
        state: shipmentData.state,
        country: shipmentData.country,
        zipcode: shipmentData.zipcode,
        shipment_date: new Date().toISOString(), // Thêm ngày hiện tại nếu cần
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create shipment');
    }

    const newShipment = await response.json();
    return newShipment;
  } catch (error) {
    throw new Error(`Lỗi tạo shipment: ${error.message}`);
  }
};

// Hàm helper để tạo payment
const createPayment = async (paymentData, total) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_date: new Date().toISOString(),
        amount: total,
        payment_method: paymentData.method || 'card',
        // Có thể thêm status: 'pending', etc.
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment');
    }

    const newPayment = await response.json();
    return newPayment;
  } catch (error) {
    throw new Error(`Lỗi tạo payment: ${error.message}`);
  }
};

export default function CheckoutScreen() {
  const { user } = useUser();
  const customerId = user?.id;
  const { cartItems, total } = useCart(customerId);
  const navigation = useNavigation();

  // Sử dụng hook cho state form (nếu hook chỉ quản lý state, không call API)
  // Giả sử useCheckout chỉ quản lý state, không tạo API; nếu có, cần tách
  const {
    shipmentData,
    paymentData,
    onShipmentChange,
    onPaymentChange,
    // Bỏ handleCheckout vì chúng ta tự implement
  } = useCheckout(total, customerId); // Giữ hook nếu nó chỉ cho state

  // Local state cho loading và error ở đây
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleBack = () => {
    navigation.goBack();
  };

  // Empty cart state (giữ nguyên)
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

  // Local error state (nếu có lỗi từ tạo shipment/payment)
  if (localError) {
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
            <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>Lỗi: {localError}</Text>
            <TouchableOpacity onPress={() => setLocalError(null)} style={checkoutStyles.emptyButton}>
              <Text style={checkoutStyles.emptyButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Xử lý xác nhận đơn hàng: Tạo shipment và payment trước, lấy ID, rồi navigate
  const handleConfirmOrder = async () => {
    if (cartItems.length === 0 || !customerId) {
      Alert.alert('Lỗi', 'Vui lòng kiểm tra giỏ hàng và đăng nhập!');
      return;
    }

    setLocalLoading(true);
    setLocalError(null);

    try {
      // Bước 1: Tạo shipment và lấy ID
      const newShipment = await createShipment(shipmentData);
      console.log('New shipment created:', newShipment);

      // Bước 2: Tạo payment và lấy ID
      const newPayment = await createPayment(paymentData, total);
      console.log('New payment created:', newPayment);

      // Bước 3: Thu thập dữ liệu đầy đủ với ID để truyền sang OrderConfirmScreen
      const orderDataToPass = {
        cartItems, // Để tạo orderItems
        shipment: { ...shipmentData, id: newShipment.id }, // Thêm ID
        payment: { ...paymentData, amount: total, id: newPayment.id }, // Thêm ID và amount
        total,
        customerId,
        shipmentId: newShipment.id, // Truyền riêng ID để tạo order
        paymentId: newPayment.id,
      };

      // Navigate với dữ liệu (sẽ tạo order ở screen tiếp theo)
      navigation.navigate('(buyer)/components/OrderConfirmScreen', { orderData: orderDataToPass });
    } catch (err) {
      setLocalError(err.message);
      console.error('Error in handleConfirmOrder:', err);
      Alert.alert('Lỗi', err.message);
    } finally {
      setLocalLoading(false);
    }
  };

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

          {/* Cart Items List (giữ nguyên) */}
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

        {/* Cart Summary - dùng handleConfirmOrder với local loading */}
        <View style={checkoutStyles.summary}>
          <Text style={checkoutStyles.totalText}>Tổng cộng: {total.toLocaleString('vi-VN')} VNĐ</Text>
          <TouchableOpacity 
            style={[checkoutStyles.button, localLoading && { opacity: 0.7 }]} 
            onPress={handleConfirmOrder}
            disabled={localLoading || cartItems.length === 0 || !customerId}
          >
            {localLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={checkoutStyles.buttonText}>Xác nhận đơn hàng</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}