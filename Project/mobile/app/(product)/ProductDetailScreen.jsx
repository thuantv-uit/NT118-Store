import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { API_URL } from "../../constants/api";
import { COLORS } from "../../constants/colors";

const ProductDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Lấy id từ route params
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Product ID is required");
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/product/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching product:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Error: {error || "Product not found"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Back to List</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={styles.headerSpacer} /> {/* Empty space for balance */}
      </View>

      {/* IMAGE */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/300x300?text=Product+Image" }} // Placeholder image
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productSKU}>SKU: {product.SKU}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price</Text>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stock</Text>
          <Text style={styles.productStock}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{product.category_name || "Unknown"}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Styles tương tự ProductsScreen, mở rộng cho detail
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
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  imageContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
  },
  productImage: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
  content: {
    padding: 16,
    backgroundColor: COLORS.white,
    flex: 1,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  productSKU: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  productStock: {
    fontSize: 16,
    color: COLORS.text,
  },
  categoryTag: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "500",
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
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
};

export default ProductDetailScreen;