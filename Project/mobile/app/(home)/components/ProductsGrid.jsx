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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/product`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => {
        // console.log('Navigate to product detail:', item.id);
        navigation.navigate('(home)/components/ProductDetail', { id: item.id });
      }}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage}
        defaultSource={{ uri: 'https://via.placeholder.com/150' }} // Fallback nếu image lỗi
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
          {item.price.toLocaleString()}₫
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
        <TouchableOpacity onPress={() => {/* Retry fetch */}}>
          <Text>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.section, { paddingTop: 6 }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sản phẩm</Text>
        <TouchableOpacity 
          onPress={() => {
            // Placeholder: Navigate đến full Products list
            console.log('View all products');
          }}
        >
          <Text style={styles.sectionMore}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* <FlatList
        data={products}
        numColumns={2}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
        contentContainerStyle={styles.productsGrid}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text>Không có sản phẩm nào</Text>
          </View>
        }
      /> */}

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