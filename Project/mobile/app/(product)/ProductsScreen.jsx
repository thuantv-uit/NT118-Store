import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../constants/api";
import { COLORS } from "../../constants/colors";

// Hardcoded categories fallback (nếu backend không join category_name)
const CATEGORIES = [
  { id: 1, name: "Điện thoại" },
  { id: 2, name: "Laptop" },
  { id: 3, name: "Tai nghe" },
  { id: 4, name: "Khác" },
];

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/product`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Map category name
        const productsWithCategory = data.map(product => ({
          ...product,
          categoryName: product.category_name || CATEGORIES.find(cat => cat.id === product.category_id)?.name || "Unknown",
        }));
        setProducts(productsWithCategory);
      } catch (err) {
        console.error("Error fetching products:", err);
        // Nếu lỗi, set products rỗng hoặc alert tùy bạn
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewCart = () => {
    router.push("/CartScreen"); // Navigate tới Cart screen
  };

  const handleViewDetail = (productId) => {
    router.push({ pathname: "/ProductDetailScreen", params: { id: productId } }); // Navigate tới ProductDetail với ID sản phẩm
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      {/* Placeholder image */}
      <Image
        source={{ uri: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS3bhS7yfnTe2MrIcwTRsEVQvzExL9JQG29TmDZ6PMPDA4vw1fyvn01FGrw2Zu3MAtDhiNNq3Kbp847qy1AHIgINKsk8dpAF1D55SdgVoGtq93VhMdkbNei7Rz-QYk3CFHbIl9fXg&usqp=CAc" }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name || "Unnamed Product"}</Text>
        <Text style={styles.productSKU}>SKU: {item.SKU || "N/A"}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description || "No description"}
        </Text>
        <View style={styles.productDetails}>
          <Text style={styles.productPrice}>${(item.price || 0)}</Text>
          <Text style={styles.productStock}>Stock: {item.stock || 0}</Text>
        </View>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.categoryName}</Text>
        </View>
        {/* Button Xem chi tiết */}
        <TouchableOpacity style={styles.detailButton} onPress={() => handleViewDetail(item.id)}>
          <Text style={styles.detailButtonText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Products</Text>
        {/* Button Giỏ hàng */}
        <TouchableOpacity style={styles.cartButton} onPress={handleViewCart}>
          <Text style={styles.cartButtonText}>🛒 Giỏ hàng</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // An toàn cho key
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Styles cơ bản (gọn gàng) - Thêm styles cho buttons mới
const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  cartButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cartButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  productSKU: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  productStock: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  categoryTag: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "500",
  },
  detailButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  detailButtonText: {
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
};

export default ProductsScreen;