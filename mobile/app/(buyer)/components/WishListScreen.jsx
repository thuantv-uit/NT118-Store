import { useAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from 'react-native-vector-icons';
import { API_URL } from '../../../constants/api';

const WishlistScreen = () => {
  const navigation = useNavigation(); // Dùng useNavigation cho React Navigation
  const { userId, isLoaded } = useAuth();
  const [wishlist, setWishlist] = useState([]); // Array của { id: wishlist_id, product_id, name, image }
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded || !userId) {
      setLoading(false);
      return;
    }

    fetchWishlist();
  }, [userId, isLoaded]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/wish_list/customer/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Giả sử data là array [{ id: wishlist_id, product_id: 1 }, ...]

      // Fetch chi tiết sản phẩm cho từng product_id
      const productDetails = await Promise.all(
        data.map(async (item) => {
          const productResponse = await fetch(`${API_URL}/product/${item.product_id}`);
          if (productResponse.ok) {
              const productData = await productResponse.json();
              return {
                id: item.id, // wishlist_id
                product_id: item.product_id, // Giữ để navigate
                name: productData.name || 'Sản phẩm không tên',
                image: productData.images?.[0] || require('../../../assets/images/welcome/Logo_welcome.svg'), // Hình ảnh đầu tiên
              };
            }
            return null; // Skip nếu fetch fail
          })
        );

      // Lọc bỏ null items
      const validProducts = productDetails.filter(Boolean);
      setWishlist(validProducts);
    } catch (err) {
      setError(err.message);
      Alert.alert('Lỗi', 'Không thể tải danh sách yêu thích!');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWishlist();
    setRefreshing(false);
  };

  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
      const response = await fetch(`${API_URL}/wish_list/${wishlistId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Không thể xóa!');
      }
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistId));
      Alert.alert('Thành công', 'Đã xóa khỏi danh sách yêu thích!');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể xóa khỏi danh sách yêu thích!');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => navigation.navigate('(home)/components/ProductDetail', { id: item.product_id })} // Navigate với product_id
      >
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
        />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromWishlist(item.id)} // Xóa với wishlist_id
        >
          <Ionicons name="trash-outline" size={20} color="#FF0000" />
          <Text style={styles.removeText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color="#FF8A65" style={styles.center} />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FF8A65" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Danh sách yêu thích</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ActivityIndicator size="large" color="#FF8A65" style={styles.center} />
        <Text style={styles.loadingText}>Đang tải danh sách yêu thích...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FF8A65" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Danh sách yêu thích</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF8A65" />
          <Text style={styles.errorText}>Lỗi: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchWishlist} // Fetch lại thay vì reload
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FF8A65" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách yêu thích</Text>
        <View style={styles.headerSpacer} />
      </View>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF8A65']}
            tintColor="#FF8A65"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color="#FF8A65" />
            <Text style={styles.emptyText}>Danh sách yêu thích trống</Text>
            <Text style={styles.emptySubText}>Thêm sản phẩm yêu thích để xem ở đây!</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF6F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B453F',
    textAlign: 'center',
    marginLeft: -20, // Adjust để center
  },
  headerSpacer: { width: 24 }, // Spacer cho back button symmetry
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#666',
    textAlign: 'center',
  },
  errorText: { 
    fontSize: 16, 
    color: '#FF5722', 
    marginBottom: 10, 
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#FF8A65',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  retryText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16 
  },
  listContainer: { 
    padding: 16, 
    paddingBottom: 20,
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 138, 101, 0.1)',
  },
  imageContainer: { 
    marginRight: 16,
    justifyContent: 'center',
  },
  productImage: { 
    width: 72, 
    height: 72, 
    borderRadius: 16,
    resizeMode: 'cover',
  },
  infoContainer: { 
    flex: 1, 
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  name: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#5B453F', 
    marginBottom: 4,
    lineHeight: 20,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFE5E5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.1)',
  },
  removeText: { 
    marginLeft: 6, 
    color: '#FF0000', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: { 
    fontSize: 20, 
    color: '#8D6E63', 
    marginTop: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#A8A29E',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default WishlistScreen;
