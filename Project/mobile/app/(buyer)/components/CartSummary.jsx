import { Text, TouchableOpacity, View } from 'react-native';
import { buyerStyles } from '../styles/BuyerStyles';

export default function CartSummary({ total, onCheckout }) {
  return (
    <View style={buyerStyles.summary}>
      <View style={buyerStyles.totalRow}>
        <Text style={buyerStyles.totalLabel}>Tổng cộng:</Text>
        <Text style={buyerStyles.totalAmount}>{total.toLocaleString()}₫</Text>
      </View>
      <TouchableOpacity style={buyerStyles.checkoutButton} onPress={onCheckout}>
        <Text style={buyerStyles.checkoutText}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
}