import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { API_URL } from '../../../constants/api';
import { primary, styles, text } from '../_styles/HomeStyles';

const API_BASE_URL = API_URL;

export default function ProductsGrid({ categoryId = null, searchQuery = '' }) {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Lưu tất cả sản phẩm
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/product`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Fallback nếu data có vấn đề
      const processedProducts = (data || []).map(p => ({
        ...p,
        name: p.name || 'Sản phẩm không tên',
        category_name: p.category_name || '',
        // SỬA: Giá thấp nhất từ variants, hình ảnh đầu tiên từ images
        minPrice: p.variants && p.variants.length > 0 ? Math.min(...p.variants.map(v => v.price)) : 0,
        firstImage: p.images && p.images.length > 0 ? p.images[0] : require('../../../assets/images/welcome/Logo_welcome.svg')
      }));
      setAllProducts(processedProducts);
      setProducts(processedProducts);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Filter products khi categoryId hoặc searchQuery thay đổi
  useEffect(() => {
    let filtered = [...allProducts];
    
    // Filter theo category
    if (categoryId) {
      filtered = filtered.filter(p => p.category_id === categoryId);
    }
    
    // Filter theo search
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.category_name && p.category_name.toLowerCase().includes(query))
      );
    }
    
    setProducts(filtered);
  }, [categoryId, searchQuery, allProducts]);

  const handleRetry = () => {
    fetchProducts();
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('(home)/components/ProductDetail', { id: item.id })}
    >
      <Image 
        source={{ uri: item.firstImage }} 
        style={styles.productImage}
      />
      <View style={styles.productMeta}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.category_name && (
          <Text style={[styles.productName, { fontSize: 12, color: 'gray' }]}>
            {item.category_name}
          </Text>
        )}
        <Text style={styles.productPrice}>
          {(item.minPrice || 0).toLocaleString()}₫
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.section, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={primary} />
        <Text style={{ color: text, marginTop: 6, fontWeight: '600' }}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.section, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: primary, fontWeight: '700', textAlign: 'center' }}>Lỗi: {error}</Text>
        <TouchableOpacity 
          style={{ marginTop: 10, padding: 12, backgroundColor: primary, borderRadius: 12 }}
          onPress={handleRetry}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.section, { paddingTop: 6 }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sản phẩm</Text>
        <TouchableOpacity 
          onPress={() => console.log('View all products')} // Thêm navigation nếu cần
        >
          <Text style={styles.sectionMore}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        numColumns={2}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productsGrid}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text>Không có sản phẩm nào</Text>
          </View>
        }
      />
    </View>
  );
}
