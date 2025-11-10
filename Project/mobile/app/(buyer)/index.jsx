import { useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';
import { cartItems as initialCart } from './data/cartData';
import { buyerStyles } from './styles/BuyerStyles';

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState(initialCart); // Mock state, có thể từ Context/API

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) {
      removeItem(id);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    // Placeholder: Navigate đến checkout screen hoặc gọi API
    console.log('Checkout with cart:', cartItems);
    alert('Chuyển đến màn hình thanh toán!'); // Mock
  };

  const handleContinueShopping = () => {
    navigation.goBack(); // Quay về Home hoặc Product list
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#6D4C41" />
            </TouchableOpacity>
            <Text style={buyerStyles.headerTitle}>Giỏ hàng của bạn</Text>
            <View style={{ width: 24 }} /> {/* Spacer */}
          </View>
          <View style={buyerStyles.emptyCart}>
            <Icon name="cart-outline" size={80} color="#BDAAA8" />
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
            <Icon name="arrow-back" size={24} color="#6D4C41" />
          </TouchableOpacity>
          <Text style={buyerStyles.headerTitle}>Giỏ hàng ({cartItems.length})</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={cartItems}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />

        <CartSummary total={total} onCheckout={handleCheckout} />
      </View>
    </SafeAreaView>
  );
}