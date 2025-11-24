import { useUser } from '@clerk/clerk-expo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../constants/api';
import { useCart } from '../hook/useCart';
import { useCheckout } from '../hook/useCheckout';
import { buyerStyles, checkoutStyles } from '../styles/BuyerStyles';

const API_BASE_URL = API_URL;

export default function CheckoutScreen() {
  const { user } = useUser();
  const customerId = user?.id;
  const { cartItems, total } = useCart(customerId);
  const navigation = useNavigation();

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

  // Thêm state mới cho danh sách địa chỉ và địa chỉ được chọn
  const [addresses, setAddresses] = useState([]);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Fetch danh sách địa chỉ từ API khi component mount
  useEffect(() => {
    if (customerId) {
      fetchAddresses();
    }
  }, [customerId]);

  const fetchAddresses = async () => {
    try {
      setFetchingAddresses(true);
      const response = await fetch(`${API_BASE_URL}/shipment/${customerId}/addresses`);
      if (response.ok) {
        const data = await response.json();
        setAddresses(Array.isArray(data) ? data : []);
        // Tự động chọn địa chỉ đầu tiên nếu có
        if (data.length > 0 && !selectedAddressId) {
          const firstAddressId = data[0].id; // Đảm bảo id tồn tại
          setSelectedAddressId(firstAddressId);
          onShipmentChange('address_id', firstAddressId); // Sửa: dùng 'address_id' để match hook
        }
      } else {
        console.error('Lỗi khi fetch địa chỉ:', response.statusText);
      }
    } catch (err) {
      console.error('Lỗi fetch địa chỉ:', err);
    } finally {
      setFetchingAddresses(false);
    }
  };

  const handleSelectAddress = (address) => {
    const addressId = address.id; // Đảm bảo lấy id từ object
    // console.log('Selected address ID:', addressId); // Debug log để check
    setSelectedAddressId(addressId);
    onShipmentChange('address_id', addressId); // Sửa: dùng 'address_id' để match hook
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

  const onConfirmOrder = () => {
    // Kiểm tra nếu chưa chọn địa chỉ
    if (!selectedAddressId) {
      alert('Vui lòng chọn địa chỉ giao hàng!');
      return;
    }
    // console.log('Confirming with shipmentData:', shipmentData); // Debug log để check address_id đã truyền chưa
    handleCheckout(cartItems);
  };

  // Render item địa chỉ
  const renderAddressItem = ({ item }) => {
    const isSelected = selectedAddressId === item.id;
    // console.log('Rendering address item:', item.id, item); // Debug log để check structure
    return (
      <TouchableOpacity
        style={[
          checkoutStyles.option, // Reuse style từ payment options cho consistency
          isSelected && checkoutStyles.selectedOption,
        ]}
        onPress={() => handleSelectAddress(item)}
        activeOpacity={0.8}
      >
        <View style={checkoutStyles.optionLeft}>
          <MaterialCommunityIcons
            name={isSelected ? 'map-marker-check' : 'map-marker-outline'}
            size={26}
            color={isSelected ? '#fff' : '#6D4C41'}
          />
          <View>
            <Text
              style={[
                checkoutStyles.optionText,
                isSelected && { color: '#fff', fontWeight: '600' },
              ]}
            >
              {item.address || 'Địa chỉ không xác định'}
            </Text>
            <Text
              style={[
                { fontSize: 12, color: isSelected ? '#fff' : '#999' },
                isSelected && { color: '#fff' },
              ]}
            >
              {item.city}, {item.state}, {item.country} - {item.zipcode}
            </Text>
          </View>
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
          {/* Shipment Section - Thay đổi thành danh sách địa chỉ */}
          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>Chọn địa chỉ giao hàng</Text>
            {fetchingAddresses ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
                <ActivityIndicator size="small" color="#6D4C41" />
                <Text>Đang tải địa chỉ...</Text>
              </View>
            ) : addresses.length === 0 ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#999', textAlign: 'center' }}>
                  Chưa có địa chỉ nào. Vui lòng thêm địa chỉ trong tài khoản của bạn!
                </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('(profile)/components/DeliveryScreen', { screen: 'Addresses' })} // Giả định có screen quản lý địa chỉ
                  style={[checkoutStyles.emptyButton, { marginTop: 10 }]}
                >
                  <Text style={checkoutStyles.emptyButtonText}>Quản lý địa chỉ</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={addresses}
                renderItem={renderAddressItem}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // Sửa: fallback nếu id null
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {/* Payment Form - Giữ nguyên */}
          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>Phương thức thanh toán</Text>
            {checkoutStyles.paymentOptions.map((option) => {
              const isSelected = paymentData.payment_method === option.key;
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

          {/* Cart Items List - Giữ nguyên */}
          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>Giỏ hàng của bạn ({cartItems.length} sản phẩm)</Text>
            <FlatList
              data={cartItems.map(item => ({
                product: item.product || (item.cart?.product || {}),
                cart: item.cart || item,
              }))}
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
              keyExtractor={({ cart }) => cart?.id?.toString() || Math.random().toString()}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>

        {/* Cart Summary - Thêm kiểm tra selectedAddressId */}
        <View style={checkoutStyles.summary}>
          <Text style={checkoutStyles.totalText}>Tổng cộng: {total.toLocaleString('vi-VN')} VNĐ</Text>
          <TouchableOpacity 
            style={[checkoutStyles.button, loading && { opacity: 0.7 }]} 
            onPress={onConfirmOrder}
            disabled={loading || cartItems.length === 0 || !currentCustomerId || !selectedAddressId}
          >
            {loading ? (
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