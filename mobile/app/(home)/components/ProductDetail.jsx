import { useUser } from '@clerk/clerk-expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF8A65',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B453F',
    minWidth: 30,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  // Styles cho seller section (giữ nguyên)
  sellerContainer: {
    backgroundColor: '#F8F4F3',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  sellerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6D4C41',
    marginBottom: 8,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  sellerName: { fontSize: 14, fontWeight: '500', color: '#5B453F' },
  sellerEmail: { fontSize: 12, color: '#8D6E63' },
  sellerContact: {
    backgroundColor: '#FF8A65',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  sellerContactText: { color: '#fff', fontSize: 12, fontWeight: '500' },
});

const API_BASE_URL = API_URL;

export default function ProductDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null); // State cho seller
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock detail (giữ nguyên)
  const details = {
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Trắng', 'Đen', 'Xanh'],
  };

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Trắng');
  const [quantity, setQuantity] = useState(1);

  // Get user from Clerk (giữ nguyên)
  const { user, isSignedIn } = useUser();
  const customerId = user?.id;

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
        const productData = {
          ...data,
          name: data.name || 'Sản phẩm không tên',
          description: data.description || 'Không có mô tả.',
        };
        setProduct(productData);

        // Fetch seller info nếu có customer_id (người bán)
        if (productData.customer_id) {
          const sellerResponse = await fetch(`${API_BASE_URL}/customers/${productData.customer_id}`);
          if (sellerResponse.ok) {
            const sellerData = await sellerResponse.json();
            setSeller(sellerData); // Dữ liệu như { first_name, last_name, avatar, ... }
          } else {
            // console.warn('Không thể fetch seller info:', sellerResponse.status);
            setSeller(null);
          }
        }
      } catch (err) {
        setError(err.message);
        // console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Các function khác giữ nguyên (checkCustomerExists, renderSelector, handleRetry, updateQuantity, handleAddToCart)
  const checkCustomerExists = async () => {
    if (!customerId) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để tiếp tục!');
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}`);
      if (response.status === 404) {
        Alert.alert(
          'Thông báo',
          'Tài khoản của bạn chưa được cập nhật. Vui lòng hoàn tất hồ sơ trước khi mua sắm.',
          [
            {
              text: 'Bỏ qua',
              style: 'cancel',
              onPress: () => {},
            },
            {
              text: 'Cập nhật hồ sơ',
              onPress: () => {
                navigation.navigate('(profile)/components/updateProfile');
              },
            },
          ]
        );
        return false;
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (err) {
      // console.error('Error checking customer:', err);
      Alert.alert('Lỗi', 'Không thể kiểm tra hồ sơ. Vui lòng thử lại!');
      return false;
    }
  };

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

  const handleRetry = () => {
    setLoading(true);
    setError(null);
  };

  const updateQuantity = (newQty) => {
    if (newQty < 1) newQty = 1;
    setQuantity(newQty);
  };

  const handleAddToCart = async () => {
    const customerExists = await checkCustomerExists();
    if (!customerExists) {
      return;
    }

    if (!product) {
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: quantity,
          customer_id: customerId,
          product_id: product.id,
          size: selectedSize,
          color: selectedColor,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newCartItem = await response.json();
      Alert.alert('Thành công', `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      setQuantity(1);
    } catch (err) {
      // console.error('Error adding to cart:', err);
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng!');
    }
  };

    const handleContactSeller = async () => {
    // console.log("buyer_id: ", customerId);
    // console.log("seller_id: ", seller.id);
    // console.log("Full request body: ", {
    //   buyer_id: customerId,
    //   seller_id: seller.id,
    //   user_id: customerId,
    //   title: `Chat với ${seller.first_name} về sản phẩm`,
    // });
    // console.log("API URL: ", `${API_BASE_URL}/chat`);

    if (!customerId) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để liên hệ!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: customerId,
          seller_id: seller.id,
          user_id: customerId,
          title: `Chat với ${seller.first_name} về sản phẩm`,
        }),
      });

      // Log chi tiết response
      // console.log("Response status: ", response.status);
      // console.log("Response ok: ", response.ok);

      // Đọc response as TEXT trước để debug (không parse json ngay)
      const responseText = await response.text();
      // console.log("Response body (text): ", responseText.substring(0, 500));  // Log 500 ký tự đầu để tránh dài

      if (!response.ok) {
        throw new Error(`Server error ${response.status}: ${responseText.substring(0, 200)}`);
      }

      // Chỉ parse json nếu ok
      const convData = JSON.parse(responseText);
      // console.log("Parsed convData: ", convData);

      navigation.navigate('(home)/components/ChatScreen', { 
        conversationId: convData.id, 
        sellerName: `${(seller.first_name || '').trim()} ${(seller.last_name || '')}` 
      });
    } catch (err) {
      // console.error('Error creating conversation:', err);
      Alert.alert('Lỗi', `Không thể tạo cuộc trò chuyện! Chi tiết: ${err.message}`);
    }
  };

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
            onPress={handleRetry}
          >
            <Text style={detailStyles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={detailStyles.safe}>
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
          <Text style={detailStyles.price}>{(product.price || 0).toLocaleString()}₫</Text>

          {product.category_name && (
            <Text style={{ fontSize: 14, color: 'gray', marginBottom: 16 }}>
              Danh mục: {product.category_name}
            </Text>
          )}

          {/* Section seller: Hiển thị first_name + last_name + avatar */}
          {seller && (
            <View style={detailStyles.sellerContainer}>
              <Text style={detailStyles.sellerTitle}>Người bán</Text>
              <View style={detailStyles.sellerInfo}>
                {seller.avatar ? (
                  <Image 
                    source={{ uri: seller.avatar }} 
                    style={detailStyles.sellerAvatar} 
                  />
                ) : (
                  <View style={[detailStyles.sellerAvatar, { backgroundColor: '#E5C9C4' }]} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={detailStyles.sellerName}>
                    {`${(seller.first_name || '').trim()} ${(seller.last_name || '')}` || 'Người bán ẩn danh'}
                  </Text>
                  {/* Nếu cần thêm email hoặc phone, uncomment bên dưới */}
                  {/* <Text style={detailStyles.sellerEmail}>{seller.email || seller.phone_number || 'Không có thông tin liên hệ'}</Text> */}
                </View>
              </View>
              <TouchableOpacity 
            style={detailStyles.sellerContact}
            onPress={handleContactSeller} >
            <Text style={detailStyles.sellerContactText}>Liên hệ ngay</Text>
          </TouchableOpacity>
            </View>
          )}

          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Kích cỡ</Text>
            {renderSelector(details.sizes, setSelectedSize, selectedSize)}
          </View>

          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Màu sắc</Text>
            {renderSelector(details.colors, setSelectedColor, selectedColor)}
          </View>

          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Số lượng</Text>
            <View style={detailStyles.quantityContainer}>
              <TouchableOpacity
                style={detailStyles.qtyButton}
                onPress={() => updateQuantity(quantity - 1)}
              >
                <Text style={detailStyles.qtyText}>-</Text>
              </TouchableOpacity>
              <Text style={detailStyles.qtyNumber}>{quantity}</Text>
              <TouchableOpacity
                style={detailStyles.qtyButton}
                onPress={() => updateQuantity(quantity + 1)}
              >
                <Text style={detailStyles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Mô tả</Text>
            <Text style={detailStyles.description}>
              {product.description}
            </Text>
          </View>

          {product.stock !== undefined && (
            <Text style={{ fontSize: 12, color: 'green', marginBottom: 20 }}>
              Còn lại: {product.stock} sản phẩm
            </Text>
          )}

          <TouchableOpacity 
            style={detailStyles.addButton}
            onPress={handleAddToCart}
          >
            <Text style={detailStyles.addText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}