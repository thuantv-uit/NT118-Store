import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { API_URL } from "../../constants/api";
import { COLORS } from "../../constants/colors";

const DeleteCartItemScreen = () => {
  const router = useRouter();
  const { cartId } = useLocalSearchParams(); // Lấy cartId từ params
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!cartId) {
      Alert.alert("Error", "Cart ID is required.");
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`${API_URL}/cart/${cartId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete cart item");
      }

      console.log("Cart item deleted:", cartId);
      Alert.alert("Success", "Item deleted successfully!");
      router.back(); // Quay lại CartScreen
    } catch (err) {
      console.error("Error deleting cart:", err);
      Alert.alert("Error", err.message || "Failed to delete item.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isDeleting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Deleting...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Delete</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.confirmText}>Bạn có chắc muốn xóa món hàng này khỏi giỏ hàng?</Text>
        <Text style={styles.warningText}>Hành động này không thể hoàn tác.</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: {
    fontSize: 18,
    textAlign: "center",
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  warningText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.textLight,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.error,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 12,
  },
  deleteButtonText: {
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
};

export default DeleteCartItemScreen;