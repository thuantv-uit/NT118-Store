import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { buyerStyles } from '../styles/BuyerStyles';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  // Destructure from { cart, product } (product can null)
  const { cart, product } = item || {};
  const { id: cartId, quantity, size, color } = cart || {};
  const { name = 'Sản phẩm không xác định', price = 0, images = [], image } = product || {};  // from product

  const formattedPrice = parseFloat(price).toLocaleString('vi-VN'); // Parse string from API
  const imageUri = images?.[0] || image || 'https://via.placeholder.com/80x80/BDAAA8/FFFFFF?text=No+Image';

  // console.log(`CartItem for cart ${cartId}: product images=`, images, 'single image=', image, 'uri=', imageUri); // Debug images

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(cartId, quantity - 1);
    } else {
      onRemove(cartId);
    }
  };

  const handleIncrease = () => onUpdateQuantity(cartId, quantity + 1);

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
          Kích cỡ: {size || 'N/A'} | Màu: {color || 'N/A'}
        </Text>
        <Text style={buyerStyles.itemPrice}>{formattedPrice}₫</Text>
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
            style={buyerStyles.qtyButton}
            onPress={handleIncrease}
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