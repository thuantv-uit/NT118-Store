import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { buyerStyles } from '../styles/BuyerStyles';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  // SỬA: Destructure từ { cart, product, variant }
  const { cart, product, variant } = item || {};
  const { id: cartId, quantity } = cart || {};
  const { name = 'Sản phẩm không xác định' } = product || {};
  const { price = 0, size = 'N/A', color = 'N/A', stock = 0 } = variant || {};  // SỬA: Dùng variant

  const formattedPrice = parseFloat(price).toLocaleString('vi-VN'); // Parse string from API
  const imageUri = product?.images?.[0] || product?.image || 'https://via.placeholder.com/80x80/BDAAA8/FFFFFF?text=No+Image';

  // console.log(`CartItem for cart ${cartId}: variant=`, variant, 'uri=', imageUri); // Debug

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(cartId, quantity - 1);
    } else {
      onRemove(cartId);
    }
  };

  const handleIncrease = () => {
    if (stock > 0 && quantity < stock) {
      onUpdateQuantity(cartId, quantity + 1);
    } else if (stock === 0) {
      Alert.alert('Cảnh báo', 'Sản phẩm đã hết hàng!');
    }
  };

  return (
    <View style={buyerStyles.cartItem}>
      <Image 
        source={{ uri: imageUri }} 
        style={buyerStyles.itemImage}
        resizeMode="cover"
        defaultSource={{ uri: 'https://via.placeholder.com/80x80/BDAAA8/FFFFFF?text=Loading...' }}
      />
      <View style={buyerStyles.itemInfo}>
        <Text style={buyerStyles.itemName} numberOfLines={2} ellipsizeMode="tail">
          {name}
        </Text>
        <Text style={buyerStyles.itemDetails}>
          Kích cỡ: {size} | Màu: {color}
        </Text>
        <Text style={buyerStyles.itemPrice}>{formattedPrice}₫</Text>
        {stock > 0 && (
          <Text style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>
            Còn lại: {stock}
          </Text>
        )}
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={buyerStyles.quantityContainer}>
          <TouchableOpacity
            style={[
              buyerStyles.qtyButton,
              quantity <= 1 && { opacity: 0.5 }
            ]}
            onPress={handleDecrease}
            disabled={quantity <= 1}
            accessibilityLabel={`Giảm số lượng của ${name}`}
            accessibilityRole="button"
          >
            <Text style={buyerStyles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={buyerStyles.qtyNumber}>{quantity}</Text>
          <TouchableOpacity
            style={[
              buyerStyles.qtyButton,
              stock === 0 && { opacity: 0.5 }
            ]}
            onPress={handleIncrease}
            disabled={stock === 0}
            accessibilityLabel={`Tăng số lượng của ${name}`}
            accessibilityRole="button"
          >
            <Text style={buyerStyles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={buyerStyles.removeButton}
          onPress={() => onRemove(cartId)}
          accessibilityLabel={`Xóa ${name} khỏi giỏ hàng`}
          accessibilityRole="button"
        >
          <Icon name="trash-outline" size={20} color="#FF5722" />
        </TouchableOpacity>
      </View>
    </View>
  );
}