import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API_URL } from "../../constants/api";
import { COLORS } from "../../constants/colors";

const CartScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setError("User not authenticated. Please sign in.");
      setIsLoading(false);
      return;
    }

    const fetchCarts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const cartResponse = await fetch(`${API_URL}/cart/${user.id}`);
        if (!cartResponse.ok) {
          throw new Error("Failed to fetch carts");
        }
        const carts = await cartResponse.json();

        const itemsWithProducts = await Promise.all(
          carts.map(async (cart) => {
            const productResponse = await fetch(`${API_URL}/product/${cart.product_id}`);
            if (!productResponse.ok) {
              console.warn(`Failed to fetch product ${cart.product_id}`);
              return { ...cart, name: "Unknown Product", price: 0 };
            }
            const product = await productResponse.json();
            return {
              ...cart,
              name: product.name || "Unnamed Product",
              price: product.price || 0,
            };
          })
        );

        setCartItems(itemsWithProducts || []);
        setSelectedItems(new Set());
      } catch (err) {
        setError(err.message);
        console.error("Error fetching carts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarts();
  }, [user?.id]);

  const handleBackToProducts = () => {
    router.back();
  };

  const toggleItemSelection = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  const handleDeleteItem = (itemId) => {
    router.push({ pathname: "/DeleteCart", params: { cartId: itemId } });
  };

  const handleCheckout = () => {
    const selectedItemsList = cartItems.filter(item => selectedItems.has(item.id));
    if (selectedItemsList.length === 0) {
      // Có thể thêm alert hoặc thông báo nếu không chọn item nào
      return;
    }
    const total = selectedItemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const selectedCartIds = Array.from(selectedItems).join(','); // Truyền IDs các selected items
    router.push({
      pathname: "/CreatePayment",
      params: { 
        amount: total.toFixed(2),
        cartIds: selectedCartIds
      }
    });
  };

  const selectedItemsList = cartItems.filter(item => selectedItems.has(item.id));
  const total = selectedItemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Back to Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          <>
            <TouchableOpacity style={styles.selectAllButton} onPress={selectAll}>
              <Text style={styles.selectAllText}>
                {selectedItems.size === cartItems.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </Text>
            </TouchableOpacity>

            {cartItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleItemSelection(item.id)}
                >
                  <View style={[styles.checkboxIcon, selectedItems.has(item.id) && styles.checkboxSelected]}>
                    {selectedItems.has(item.id) && <Text style={styles.checkboxCheck}>✓</Text>}
                  </View>
                </TouchableOpacity>

                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price} x {item.quantity}</Text>
                  <Text style={styles.itemTotal}>Tổng: ${(item.price * item.quantity).toFixed(2)}</Text>
                </View>

                {/* Delete Button */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteItem(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </View>

      {selectedItemsList.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>
            Tổng cộng ({selectedItemsList.length} món): ${total.toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
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
  selectAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.accent,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  selectAllText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 50,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
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
  checkbox: {
    marginRight: 12,
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.textLight,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  checkboxSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkboxCheck: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  itemContent: {
    flex: 1,
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
  deleteButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "500",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default CartScreen;