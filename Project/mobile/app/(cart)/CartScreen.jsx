import { useRouter } from "expo-router"; // Giả sử dùng Expo Router; nếu dùng React Navigation thì thay bằng useNavigation
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors"; // Giả sử bạn có file colors này

const CartScreen = () => {
  const router = useRouter();

  const handleBackToProducts = () => {
    router.back(); // Quay lại màn hình trước (Products)
  };

  // Dữ liệu giả để test logic (bạn có thể thay bằng state thực tế sau)
  const cartItems = [
    { id: 1, name: "iPhone 14", price: 999, quantity: 1 },
    { id: 2, name: "AirPods Pro", price: 249, quantity: 2 },
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ Hàng Của Bạn</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToProducts}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách items */}
      <View style={styles.itemsContainer}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Giỏ hàng trống!</Text>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price} x {item.quantity}</Text>
              <Text style={styles.itemTotal}>Tổng: ${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))
        )}
      </View>

      {/* Tổng tiền và Checkout */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Tổng cộng: ${total.toFixed(2)}</Text>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  backButton: {
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "500",
  },
  itemsContainer: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 50,
  },
  itemCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
    textAlign: "center",
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default CartScreen;