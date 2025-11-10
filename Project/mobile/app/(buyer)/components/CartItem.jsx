import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { buyerStyles } from '../styles/BuyerStyles';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { id, name, price, image, size, color, quantity } = item;

  return (
    <View style={buyerStyles.cartItem}>
      <Image source={{ uri: image }} style={buyerStyles.itemImage} />
      <View style={buyerStyles.itemInfo}>
        <Text style={buyerStyles.itemName} numberOfLines={2}>{name}</Text>
        <Text style={buyerStyles.itemDetails}>
          Kích cỡ: {size} | Màu: {color}
        </Text>
        <Text style={buyerStyles.itemPrice}>{price.toLocaleString()}₫</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <View style={buyerStyles.quantityContainer}>
          <TouchableOpacity
            style={buyerStyles.qtyButton}
            onPress={() => onUpdateQuantity(id, quantity - 1)}
          >
            <Text style={buyerStyles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={buyerStyles.qtyNumber}>{quantity}</Text>
          <TouchableOpacity
            style={buyerStyles.qtyButton}
            onPress={() => onUpdateQuantity(id, quantity + 1)}
          >
            <Text style={buyerStyles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={buyerStyles.removeButton}
          onPress={() => onRemove(id)}
        >
          <Icon name="trash-outline" style={buyerStyles.removeIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}