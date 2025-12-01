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
import { styles } from '../styles/HomeStyles';

const API_BASE_URL = API_URL;

export default function ProductsGrid() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
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
      setProducts((data || []).map(p => ({
        ...p,
        name: p.name || 'Sản phẩm không tên',
        category_name: p.category_name || '',
        // SỬA: Giá thấp nhất từ variants, hình ảnh đầu tiên từ images
        minPrice: p.variants && p.variants.length > 0 ? Math.min(...p.variants.map(v => v.price)) : 0,
        firstImage: p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/150'
      })));
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
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.section, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red' }}>Lỗi: {error}</Text>
        <TouchableOpacity 
          style={{ marginTop: 10, padding: 10, backgroundColor: '#FF8A65', borderRadius: 5 }}
          onPress={handleRetry}
        >
          <Text style={{ color: '#fff' }}>Thử lại</Text>
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