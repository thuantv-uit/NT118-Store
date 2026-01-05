import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from 'react-native-vector-icons';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';
import { useCart } from './_hook/useCart';
import { buyerStyles } from './_styles/BuyerStyles';

export default function CartScreen() {
  const { user } = useUser();
  const customerId = user?.id;
  const navigation = useNavigation();

  const {
    cartItems,  // SỬA: Array { cart, product, variant }
    loading,
    error,
    total,  // SỬA: Tính từ variant.price * quantity
    updateQuantity,
    removeItem,
    refetchCart,
  } = useCart(customerId);

  const handleCheckout = () => {
    // console.log('Checkout with cart:', cartItems);
    // Alert.alert('Thanh toán', 'Chuyển đến màn hình thanh toán!');
    navigation.navigate('(buyer)/components/CheckoutScreen');
  };

  const handleContinueShopping = () => {
    navigation.goBack();
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
      <View style={buyerStyles.container}>
        <View style={[buyerStyles.header, { justifyContent: 'center' }]}>
        <Text style={[buyerStyles.headerTitle, { fontSize: 14 }]}>Đang tải giỏ hàng...</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#6D4C41" />
        </View>
      </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#6D4C41" />
            </TouchableOpacity>
            <Text style={buyerStyles.headerTitle}>Giỏ hàng của bạn</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red', textAlign: 'center' }}>Lỗi: {error}</Text>
            <TouchableOpacity onPress={refetchCart} style={{ marginTop: 10 }}>
              <Text>Thử lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#6D4C41" />
            </TouchableOpacity>
            <Text style={buyerStyles.headerTitle}>Giỏ hàng của bạn</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={buyerStyles.emptyCart}>
            <Ionicons name="cart-outline" size={80} color="#BDAAA8" />
            <Text style={buyerStyles.emptyText}>Giỏ hàng trống</Text>
            <Text style={{ fontSize: 14, color: '#8D6E63' }}>
              Thêm sản phẩm để bắt đầu mua sắm!
            </Text>
            <TouchableOpacity 
              style={buyerStyles.emptyButton} 
              onPress={handleContinueShopping}
            >
              <Text style={buyerStyles.emptyButtonText}>Tiếp tục mua sắm</Text>
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#6D4C41" />
          </TouchableOpacity>
          <Text style={buyerStyles.headerTitle}>Giỏ hàng ({cartItems.length})</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={cartItems}  // SỬA: Array { cart, product, variant }
          renderItem={({ item }) => (  // item = { cart, product, variant }
            <CartItem
              item={item}  // SỬA: Transmit { cart, product, variant } – CartItem sẽ dùng variant.price, variant.size, variant.color, etc.
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          )}
          keyExtractor={({ cart }) => cart.id.toString()}
          showsVerticalScrollIndicator={false}
        />

        <CartSummary total={total} onCheckout={handleCheckout} />
      </View>
    </SafeAreaView>
  );
}
