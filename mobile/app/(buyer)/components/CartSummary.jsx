// CartSummary.jsx
import { Text, TouchableOpacity, View } from 'react-native';
import { buyerStyles } from '../styles/BuyerStyles';

export default function CartSummary({ total = 0, onCheckout }) {
  // Fallback if total undefined from API data
  const formattedTotal = parseFloat(total).toLocaleString('vi-VN');

  return (
    <View style={buyerStyles.summary}>
      <View style={buyerStyles.totalRow}>
        <Text style={buyerStyles.totalLabel}>Tổng cộng:</Text>
        <Text style={buyerStyles.totalAmount}>{formattedTotal}₫</Text>
      </View>
      <TouchableOpacity 
        style={[
          buyerStyles.checkoutButton, 
          total === 0 && { opacity: 0.5, backgroundColor: '#ccc' }
        ]} 
        onPress={total > 0 ? onCheckout : undefined}
        disabled={total === 0}
        accessibilityLabel={`Thanh toán tổng ${formattedTotal}₫`}
        accessibilityRole="button"
      >
        <Text style={buyerStyles.checkoutText}>
          Thanh toán {total > 0 && `(${formattedTotal}₫)`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}