import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../constants/api';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.7;

const detailStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF6F5' },
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  backButton: { fontSize: 24, color: '#6D4C41' },
  image: {
    width: width,
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  name: { fontSize: 20, fontWeight: '700', color: '#5B453F', marginBottom: 4 },
  price: { fontSize: 18, fontWeight: '700', color: '#E64A19', marginBottom: 16 },
  section: {
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#6D4C41', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  selectorItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5C9C4',
    marginRight: 8,
    marginBottom: 8,
  },
  selectorText: { fontSize: 14, color: '#6D4C41' },
  activeSelector: {
    backgroundColor: '#FF8A65',
    borderColor: '#FF8A65',
  },
  activeText: { color: '#fff' },
  description: { fontSize: 14, color: '#8D6E63', lineHeight: 20 },
  addButton: {
    backgroundColor: '#FF8A65',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  addText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: { color: 'red', marginBottom: 10 },
  retryButton: {
    backgroundColor: '#FF8A65',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: 'bold' },
});

const API_BASE_URL = API_URL;

export default function ProductDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {}; // Get id from params (transmitted from ProductGrid)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock detail (if backend don't have sizes/colors, you can fetch add to DB)
  const details = {
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Trắng', 'Đen', 'Xanh'],
  };

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Trắng');

  useEffect(() => {
    if (!id) {
      setError('Không tìm thấy ID sản phẩm!');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/product/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data); // data is object product từ API
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const renderSelector = (items, onSelect, selected) => (
    <View style={detailStyles.row}>
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            detailStyles.selectorItem,
            selected === item && detailStyles.activeSelector,
          ]}
          onPress={() => onSelect(item)}
        >
          <Text
            style={[
              detailStyles.selectorText,
              selected === item && detailStyles.activeText,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={detailStyles.safe}>
        <View style={detailStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8A65" />
          <Text style={{ marginTop: 10 }}>Đang tải chi tiết sản phẩm...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={detailStyles.safe}>
        <View style={detailStyles.errorContainer}>
          <Text style={detailStyles.errorText}>Lỗi: {error || 'Không tìm thấy sản phẩm!'}</Text>
          <TouchableOpacity
            style={detailStyles.retryButton}
            onPress={() => {
              // Retry fetch
              setLoading(true);
              setError(null);
            }}
          >
            <Text style={detailStyles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={detailStyles.safe}>
      {/* Back button */}
      <TouchableOpacity style={detailStyles.header} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" style={detailStyles.backButton} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: product.image || 'https://via.placeholder.com/300' }} 
          style={detailStyles.image} 
        />

        <View style={detailStyles.content}>
          <Text style={detailStyles.name}>{product.name}</Text>
          <Text style={detailStyles.price}>{product.price.toLocaleString()}₫</Text>

          {/* Category if any */}
          {product.category_name && (
            <Text style={{ fontSize: 14, color: 'gray', marginBottom: 16 }}>
              Danh mục: {product.category_name}
            </Text>
          )}

          {/* Size selector */}
          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Kích cỡ</Text>
            {renderSelector(details.sizes, setSelectedSize, selectedSize)}
          </View>

          {/* Color selector */}
          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Màu sắc</Text>
            {renderSelector(details.colors, setSelectedColor, selectedColor)}
          </View>

          {/* Description from API */}
          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Mô tả</Text>
            <Text style={detailStyles.description}>
              {product.description || 'Không có mô tả.'}
            </Text>
          </View>

          {/* Stock info if any */}
          {product.stock !== undefined && (
            <Text style={{ fontSize: 12, color: 'green', marginBottom: 20 }}>
              Còn lại: {product.stock} sản phẩm
            </Text>
          )}

          {/* Add to cart button */}
          <TouchableOpacity 
            style={detailStyles.addButton}
            onPress={() => {
              // Placeholder: Add to cart logic
              // Ví dụ: dispatch(addToCart({ ...product, size: selectedSize, color: selectedColor }));
              console.log('Add to cart:', { id: product.id, size: selectedSize, color: selectedColor });
            }}
          >
            <Text style={detailStyles.addText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}