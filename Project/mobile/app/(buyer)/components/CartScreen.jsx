import { useAuth } from '@clerk/clerk-expo'; // Import từ Clerk SDK (thay nếu dùng bare RN)
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CartItem from '../components/CartItem'; // Adjust path
import CartSummary from '../components/CartSummary'; // Adjust path
import { buyerStyles } from '../styles/BuyerStyles'; // Adjust path
// import { API_BASE } from '../config/api'; // Import base URL
import { API_URL } from '../../../constants/api';

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Lấy userId từ Clerk (thay vì hardcode)
  const { getToken, userId } = useAuth();
  // Lưu ý: Nếu customer_id ở backend khác userId Clerk, map nó qua (ví dụ: userId là string, backend expect number)

  // Fetch carts từ API
  const fetchCarts = async () => {
    if (!userId) {
      setError('Bạn cần đăng nhập để xem giỏ hàng');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Lấy token từ Clerk nếu cần auth header (Axios interceptor hoặc per request)
      const token = await getToken(); // Clerk token cho API nếu backend verify JWT

      const response = await axios.get(`${API_URL}/carts/customer/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Nếu backend cần auth
      });

      if (response.data && Array.isArray(response.data)) {
        // Enrich với product details (giống trước, optimize bằng backend join nếu có)
        const enrichedItems = await Promise.all(
          response.data.map(async (cart) => {
            const productRes = await axios.get(`${API_URL}/products/${cart.product_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return {
              ...cart,
              name: productRes.data.name,
              price: productRes.data.price,
              image: productRes.data.image,
            };
          })
        );
        setCartItems(enrichedItems);
        const newTotal = enrichedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(newTotal);
      } else {
        setCartItems([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Error fetching carts:', err);
      setError('Không thể tải giỏ hàng. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) {
      Alert.alert('Số lượng', 'Số lượng phải lớn hơn 0');
      return;
    }
    try {
      const token = await getToken();
      const response = await axios.put(`${API_URL}/carts/${cartId}`, { quantity: newQuantity }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setCartItems(prev => prev.map(item => 
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        ));
        // Recal total (cập nhật nhanh, không dùng cartItems cũ)
        const updatedItems = cartItems.map(item => 
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        );
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(newTotal);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      Alert.alert('Lỗi', 'Không thể cập nhật số lượng');
      fetchCarts(); // Refresh
    }
  };

  // Remove item
  const removeItem = async (cartId) => {
    Alert.alert(
      'Xóa sản phẩm',
      'Bạn có chắc muốn xóa?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              const token = await getToken();
              await axios.delete(`${API_URL}/carts/${cartId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setCartItems(prev => prev.filter(item => item.id !== cartId));
              // Recal total
              const newTotal = cartItems
                .filter(item => item.id !== cartId)
                .reduce((sum, item) => sum + (item.price * item.quantity), 0);
              setTotal(newTotal);
            } catch (err) {
              console.error('Error removing item:', err);
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
              fetchCarts();
            }
          },
        },
      ]
    );
  };

  // Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Không có sản phẩm để thanh toán');
      return;
    }
    navigation.navigate('Payment', { cartItems, total });
  };

  useEffect(() => {
    fetchCarts();
  }, [userId]); // Re-fetch nếu userId thay đổi (ví dụ: login/logout)

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={fetchCarts} style={{ marginTop: 10, padding: 10, backgroundColor: '#007AFF' }}>
          <Text style={{ color: 'white' }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={buyerStyles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        )}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>Giỏ hàng của bạn đang trống</Text>
          </View>
        }
      />
      <CartSummary total={total} onCheckout={handleCheckout} />
    </View>
  );
}