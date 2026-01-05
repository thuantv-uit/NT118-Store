import { useUser } from '@clerk/clerk-expo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from 'react-native-vector-icons';
import { API_URL } from '../../../constants/api';
import { useCart } from '../_hook/useCart';
import { useCheckout } from '../_hook/useCheckout';
import { buyerStyles, checkoutStyles } from '../_styles/BuyerStyles';

const API_BASE_URL = API_URL;

// Giả định bạn đã thêm wallet option vào checkoutStyles.paymentOptions.js hoặc tương tự:
// paymentOptions = [
//   ...các options cũ,
//   { key: 'wallet', label: 'Thanh toán bằng ví', icon: 'wallet-outline' }
// ];

export default function CheckoutScreen() {
  const { user } = useUser();
  const customerId = user?.id;
  const { cartItems, total } = useCart(customerId);  // SỬA: cartItems = [{ cart, product, variant }]
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

  // THÊM: State cho wallet
  const [wallet, setWallet] = useState(null); // { id, balance, ... }
  const [fetchingWallet, setFetchingWallet] = useState(false);
  const [walletError, setWalletError] = useState(null);

  // Fetch danh sách địa chỉ từ API khi component mount
  useEffect(() => {
    if (customerId) {
      fetchAddresses();
      fetchWallet(); // THÊM: Fetch wallet khi mount
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

  // THÊM: Fetch wallet info
  const fetchWallet = async () => {
    if (!customerId) return;
    try {
      setFetchingWallet(true);
      setWalletError(null);
      const response = await fetch(`${API_BASE_URL}/wallets/${customerId}`);
      if (response.ok) {
        const data = await response.json();
        setWallet(data);
      } else if (response.status === 404) {
        setWallet(null); // Chưa có wallet
      } else {
        setWalletError('Lỗi khi tải thông tin ví');
      }
    } catch (err) {
      console.error('Lỗi fetch wallet:', err);
      setWalletError('Lỗi kết nối');
    } finally {
      setFetchingWallet(false);
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

  // THÊM: Xử lý thanh toán bằng wallet (kiểm tra và trừ tiền)
  const handleWalletPayment = async () => {
    if (!wallet) {
      // Chưa có wallet: Hiển thị lỗi và navigate đến tạo wallet
      Alert.alert(
        'Thông báo',
        'Bạn chưa có ví điện tử. Vui lòng tạo ví trước khi thanh toán bằng ví.',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Tạo ví ngay',
            onPress: () => navigation.navigate('(wallet)/CreateWalletScreen'), // Giả định route tạo wallet
          },
        ]
      );
      return { success: false, error: 'No wallet' };
    }

    if (wallet.balance < total) {
      Alert.alert(
        'Lỗi',
        `Số dư ví không đủ (${wallet.balance.toLocaleString('vi-VN')} VNĐ). Cần ${total.toLocaleString('vi-VN')} VNĐ.`,
        [
          { text: 'OK', onPress: () => onPaymentChange('cod') }, // Fallback sang COD
          { text: 'Nạp tiền', onPress: () => navigation.navigate('(wallet)/TopUpScreen') } // Giả định route nạp tiền
        ]
      );
      return { success: false, error: 'Insufficient balance' };
    }

    try {
      // Gọi API update wallet balance (trừ tiền)
      const updateResponse = await fetch(`${API_BASE_URL}/wallets/${wallet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          amount: -total, // Trừ tiền
          description: `Thanh toán đơn hàng - Tổng: ${total.toLocaleString('vi-VN')} VNĐ`,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(`Lỗi cập nhật ví: ${updateResponse.statusText}`);
      }

      const updatedWallet = await updateResponse.json();
      setWallet(updatedWallet); // Cập nhật state wallet
      Alert.alert('Thành công', 'Đã trừ tiền từ ví. Đang xử lý đơn hàng...');
      return { success: true };
    } catch (err) {
      console.error('Lỗi thanh toán wallet:', err);
      Alert.alert('Lỗi', 'Không thể trừ tiền từ ví. Vui lòng thử lại.');
      return { success: false, error: err.message };
    }
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#6D4C41" />
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
              <Ionicons name="arrow-back" size={24} color="#6D4C41" />
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

  const onConfirmOrder = async () => {
    // Kiểm tra nếu chưa chọn địa chỉ
    if (!selectedAddressId) {
      Alert.alert('Thông báo', 'Vui lòng chọn địa chỉ giao hàng!');
      return;
    }

    // THÊM: Xử lý wallet payment nếu chọn
    if (paymentData.payment_method === 'wallet') {
      const walletResult = await handleWalletPayment();
      if (!walletResult.success) {
        return; // Dừng nếu wallet lỗi
      }
    }

    // console.log('Confirming with shipmentData:', shipmentData); // Debug log để check address_id đã truyền chưa
    handleCheckout(cartItems);  // SỬA: Pass cartItems với { cart, product, variant }
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
            name="map-marker-outline"
            size={26}
            color={isSelected ? '#fff' : '#6D4C41'}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={[
                checkoutStyles.optionText,
                isSelected && { color: '#fff', fontWeight: '600' },
              ]}
              numberOfLines={1}
            >
              {item.name || 'Địa chỉ mặc định'}  {/* Giả định có field name */}
            </Text>
            <Text
              style={[
                { 
                  fontSize: 12, 
                  color: isSelected ? 'rgba(255,255,255,0.8)' : '#8D6E63',
                  marginTop: 2,
                },
                checkoutStyles.optionText,
              ]}
              numberOfLines={2}
            >
              {`${item.address || ''}, ${item.district || ''}, ${item.city || ''}`.trim() || 'Chi tiết địa chỉ'}
            </Text>
          </View>
        </View>
        {isSelected && (
          <View style={{ 
            width: 24, 
            height: 24, 
            borderRadius: 12, 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <MaterialCommunityIcons name="check" size={16} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // THÊM: Render payment options với filter wallet nếu chưa có
  const renderPaymentOptions = () => {
    return checkoutStyles.paymentOptions
      .filter(option => option.key !== 'wallet' || !!wallet) // SỬA: Không hiển thị wallet nếu chưa có ví
      .map((option) => {
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
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    checkoutStyles.optionText,
                    isSelected && { color: '#fff', fontWeight: '600' },
                  ]}
                >
                  {option.label}
                  {option.key === 'wallet' && wallet && ` (${wallet.balance.toLocaleString('vi-VN')} VNĐ)`}
                </Text>
                {option.key === 'wallet' && wallet && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: isSelected ? 'rgba(255,255,255,0.8)' : '#00A651',
                      marginTop: 2,
                      fontWeight: '500',
                    }}
                  >
                    Số dư khả dụng
                  </Text>
                )}
              </View>
            </View>
            {isSelected && (
              <View style={{ 
                width: 24, 
                height: 24, 
                borderRadius: 12, 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <MaterialCommunityIcons name="check" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        );
      });
  };

  return (
    <SafeAreaView style={buyerStyles.safe}>
      <View style={buyerStyles.container}>
        <View style={buyerStyles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#6D4C41" />
          </TouchableOpacity>
          <Text style={buyerStyles.headerTitle}>Thanh toán</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Shipment Section - Thay đổi thành danh sách địa chỉ */}
          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>Chọn địa chỉ giao hàng</Text>
            {fetchingAddresses ? (
              <View style={{ justifyContent: 'center', alignItems: 'center', minHeight: 100, paddingVertical: 20 }}>
                <ActivityIndicator size="small" color="#6D4C41" />
                <Text style={{ fontSize: 14, color: '#666', marginTop: 8 }}>Đang tải địa chỉ...</Text>
              </View>
            ) : addresses.length === 0 ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <MaterialCommunityIcons name="map-marker-off-outline" size={48} color="#ccc" />
                <Text style={{ color: '#999', textAlign: 'center', marginTop: 8, fontSize: 14 }}>
                  Chưa có địa chỉ nào. Vui lòng thêm địa chỉ trong tài khoản của bạn!
                </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('(profile)/components/DeliveryScreen', { screen: 'Addresses' })} // Giả định có screen quản lý địa chỉ
                  style={[checkoutStyles.emptyButton, { marginTop: 12 }]}
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

          {/* Payment Form - THÊM: Option wallet, và hiển thị balance nếu có */}
          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>Phương thức thanh toán</Text>
            {/* THÊM: Hiển thị wallet info nếu có */}
            {wallet && (
              <View style={{ 
                backgroundColor: '#E8F5E8', 
                padding: 16, 
                borderRadius: 12, 
                marginBottom: 16, 
                borderLeftWidth: 4, 
                borderLeftColor: '#00A651',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="wallet" size={20} color="#00A651" />
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '600', 
                    color: '#00A651', 
                    marginLeft: 8 
                  }}>
                    Số dư ví: {wallet.balance.toLocaleString('vi-VN')} VNĐ
                  </Text>
                </View>
                {wallet.balance < total && (
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('(wallet)/TopUpScreen')} // Giả định route nạp tiền
                    style={{ 
                      backgroundColor: '#00A651', 
                      paddingHorizontal: 12, 
                      paddingVertical: 6, 
                      borderRadius: 6 
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>Nạp thêm</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {fetchingWallet && (
              <View style={{ padding: 16, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#6D4C41" />
                <Text style={{ fontSize: 14, color: '#666', marginTop: 8 }}>Đang kiểm tra ví...</Text>
              </View>
            )}
            {walletError && (
              <View style={{ 
                backgroundColor: '#FFF3CD', 
                padding: 12, 
                borderRadius: 8, 
                marginBottom: 12,
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 12, color: '#856404' }}>{walletError}</Text>
              </View>
            )}
            {!wallet && !fetchingWallet && (
              <View style={{ 
                padding: 16, 
                alignItems: 'center', 
                marginBottom: 12,
                opacity: 0.7
              }}>
                <MaterialCommunityIcons name="wallet-off-outline" size={24} color="#ccc" />
                <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>Chưa có ví. Tạo ví để thanh toán nhanh hơn!</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('(wallet)/CreateWalletScreen')}
                  style={{ 
                    marginTop: 8, 
                    paddingHorizontal: 16, 
                    paddingVertical: 6, 
                    backgroundColor: '#6D4C41', 
                    borderRadius: 6 
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 12 }}>Tạo ví ngay</Text>
                </TouchableOpacity>
              </View>
            )}
            {renderPaymentOptions()}
          </View>

          {/* Cart Items List - SỬA: Bỏ icon, giữ layout cũ, thêm bo viền đẹp */}
          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>Giỏ hàng của bạn ({cartItems.length} sản phẩm)</Text>
            <FlatList
              data={cartItems}
              renderItem={({ item }) => (
                <View style={{
                  backgroundColor: '#FFF',
                  padding: 16,
                  marginBottom: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2, 
                }}>
                  <Text style={checkoutStyles.itemName}>{item.product?.name || 'Sản phẩm'}</Text>
                  <View style={checkoutStyles.itemDetails}>
                    <Text>Số lượng: {item.cart?.quantity || 0}</Text>
                    <Text>Kích cỡ: {item.variant?.size || 'N/A'} | Màu: {item.variant?.color || 'N/A'}</Text>
                    <Text>Đơn giá: {(item.variant?.price || 0).toLocaleString('vi-VN')} VNĐ</Text>
                    <Text style={checkoutStyles.subtotal}>
                      Tạm tính: {((item.cart?.quantity || 0) * (item.variant?.price || 0)).toLocaleString('vi-VN')} VNĐ
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={({ cart }) => cart?.id?.toString() || Math.random().toString()}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>

        {/* Cart Summary - Thêm kiểm tra selectedAddressId và wallet nếu chọn wallet */}
        <View style={[checkoutStyles.summary, { paddingBottom: 20 }]}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            marginBottom: 16,
            paddingHorizontal: 16
          }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Tạm tính:</Text>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{total.toLocaleString('vi-VN')} VNĐ</Text>
          </View>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Tổng cộng:</Text>
            <Text style={[checkoutStyles.totalText, { fontSize: 18, fontWeight: 'bold' }]}>{total.toLocaleString('vi-VN')} VNĐ</Text>
          </View>
          <TouchableOpacity 
            style={[checkoutStyles.button, loading && { opacity: 0.7 }]} 
            onPress={onConfirmOrder}
            disabled={loading || cartItems.length === 0 || !currentCustomerId || !selectedAddressId || (paymentData.payment_method === 'wallet' && !wallet)}
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