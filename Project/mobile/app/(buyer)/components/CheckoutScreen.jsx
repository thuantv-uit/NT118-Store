import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
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
import { useCart } from '../hook/useCart';
import { buyerStyles, checkoutStyles } from '../styles/BuyerStyles';

export default function CheckoutScreen() {
  const { user } = useUser();
  const customerId = user?.id;
  const { cartItems, total } = useCart(customerId);
  const navigation = useNavigation();

  const [shipmentData, setShipmentData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
  });
  const [paymentData, setPaymentData] = useState({
    method: 'card', // Default: card, cash, bank_transfer
  });

  const handleShipmentChange = (field, value) => {
    setShipmentData({ ...shipmentData, [field]: value });
  };

  const handlePaymentChange = (method) => {
    setPaymentData({ ...paymentData, method });
  };

  const handleSubmit = () => {
    // Validate form (simple check)
    if (!shipmentData.address || !shipmentData.city || !paymentData.method) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // TODO: Gọi API real: POST /api/orders với {shipmentData, paymentData, cartItems}
    console.log('Submit checkout:', { shipmentData, paymentData, cartItems, total });

    // Navigate to OrderConfirm with data
    navigation.navigate('(buyer)/components/OrderConfirmScreen', {
      orderData: {
        id: 'ORD-' + Date.now(), // Placeholder, thay bằng real ID
        date: new Date().toISOString(),
        items: cartItems,
        shipment: shipmentData,
        payment: paymentData,
        total,
      },
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

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
          {/* Shipment Form */}
          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>Thông tin giao hàng</Text>
            <TextInput
              style={checkoutStyles.input}
              placeholder="Địa chỉ giao hàng"
              value={shipmentData.address}
              onChangeText={(value) => handleShipmentChange('address', value)}
            />
            <TextInput
              style={checkoutStyles.input}
              placeholder="Thành phố"
              value={shipmentData.city}
              onChangeText={(value) => handleShipmentChange('city', value)}
            />
            <TextInput
              style={checkoutStyles.input}
              placeholder="Tỉnh/Thành"
              value={shipmentData.state}
              onChangeText={(value) => handleShipmentChange('state', value)}
            />
            <TextInput
              style={checkoutStyles.input}
              placeholder="Quốc gia"
              value={shipmentData.country}
              onChangeText={(value) => handleShipmentChange('country', value)}
            />
            <TextInput
              style={checkoutStyles.input}
              placeholder="Mã bưu điện"
              value={shipmentData.zipcode}
              onChangeText={(value) => handleShipmentChange('zipcode', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Payment Form */}
          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>Phương thức thanh toán</Text>
            {checkoutStyles.paymentOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  checkoutStyles.option,
                  paymentData.method === option.key && checkoutStyles.selectedOption,
                ]}
                onPress={() => handlePaymentChange(option.key)}
              >
                <Icon name={option.icon} size={24} color="#6D4C41" />
                <Text style={checkoutStyles.optionText}>{option.label}</Text>
                {paymentData.method === option.key && <Icon name="checkmark" size={20} color="#6D4C41" />}
              </TouchableOpacity>
            ))}
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

        {/* Cart Summary */}
        <View style={checkoutStyles.summary}>
          <Text style={checkoutStyles.totalText}>Tổng cộng: {total.toLocaleString('vi-VN')} VNĐ</Text>
          <TouchableOpacity style={checkoutStyles.button} onPress={handleSubmit}>
            <Text style={checkoutStyles.buttonText}>Xác nhận đơn hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}