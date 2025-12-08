import { useUser } from '@clerk/clerk-expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
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

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.5;

const detailStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF6F5' },
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: { fontSize: 24, color: '#6D4C41' },
  imagesContainer: {
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  imageItem: {
    width: width,
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
  },
  // SỬA: Thêm dots indicator cho images
  dotsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: '#FF8A65',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#5B453F', marginBottom: 8, lineHeight: 28 },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: { fontSize: 22, fontWeight: 'bold', color: '#E64A19', marginRight: 8 },
  priceBadge: {
    backgroundColor: '#FF8A65',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priceBadgeText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  category: { fontSize: 14, color: 'gray', marginBottom: 16 },
  section: {
    marginBottom: 24,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#6D4C41', 
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE8',
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  selectorItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5C9C4',
    marginRight: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectorText: { fontSize: 14, color: '#6D4C41', fontWeight: '500' },
  activeSelector: {
    backgroundColor: '#FF8A65',
    borderColor: '#FF8A65',
    shadowColor: '#FF8A65',
    shadowOpacity: 0.2,
  },
  activeText: { color: '#fff', fontWeight: '600' },
  description: { 
    fontSize: 14, 
    color: '#8D6E63', 
    lineHeight: 22,
    textAlign: 'justify',
  },
  // SỬA: Format description sections
  descSection: {
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#F8F4F3',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8A65',
  },
  descTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6D4C41',
    marginBottom: 4,
  },
  descText: { fontSize: 13, color: '#8D6E63', lineHeight: 20 },
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
    borderRadius: 25,
    paddingHorizontal: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF8A65',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  qtyNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5B453F',
    minWidth: 40,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  stockInfo: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Styles cho seller section (cải thiện)
  sellerContainer: {
    backgroundColor: '#F8F4F3',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sellerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6D4C41',
    marginBottom: 12,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  sellerName: { fontSize: 16, fontWeight: '600', color: '#5B453F' },
  // THÊM: Styles cho row icons dưới cùng
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  actionIconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF8A65',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    fontSize: 28,
    color: '#fff',
  },
  actionIconDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
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

  // SỬA: Dynamic details từ variants
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Cho dots indicator
  // THÊM: State cho wishlist
  const [isInWishlist, setIsInWishlist] = useState(false);

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

        // SỬA: Extract unique sizes/colors từ variants
        if (productData.variants && productData.variants.length > 0) {
          const sizes = [...new Set(productData.variants.map(v => v.size))];
          const colors = [...new Set(productData.variants.map(v => v.color))];
          setAvailableSizes(sizes);
          setAvailableColors(colors);
          setSelectedSize(sizes[0] || '');
          setSelectedColor(colors[0] || '');
        }

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

  // SỬA: Update selected variant khi thay đổi size/color
  useEffect(() => {
    if (product && product.variants && selectedSize && selectedColor) {
      const matchingVariant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
        setCurrentPrice(matchingVariant.price);
        setCurrentStock(matchingVariant.stock);
      } else {
        setSelectedVariant(null);
        setCurrentPrice(0);
        setCurrentStock(0);
      }
    }
  }, [selectedSize, selectedColor, product]);

  // SỬA: Callback cho image index change (dots indicator)
  const onImageScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentImageIndex(index);
  };

  // Các function khác giữ nguyên (checkCustomerExists, renderSelector, handleRetry, updateQuantity, handleAddToCart, handleContactSeller)
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
    if (selectedVariant && newQty > selectedVariant.stock) {
      Alert.alert('Cảnh báo', `Chỉ còn ${selectedVariant.stock} sản phẩm!`);
      newQty = selectedVariant.stock;
    }
    setQuantity(newQty);
  };

  const handleAddToCart = async () => {
    const customerExists = await checkCustomerExists();
    if (!customerExists) {
      return;
    }

    if (!selectedVariant) {
      Alert.alert('Lỗi', 'Vui lòng chọn kích cỡ và màu sắc!');
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
          // Thêm variant_id nếu backend cần
          variant_id: selectedVariant.id,
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

  // THÊM: Handle wishlist
  const handleAddToWishlist = async () => {
    const customerExists = await checkCustomerExists();
    if (!customerExists) {
      return;
    }

    if (!product) {
      Alert.alert('Lỗi', 'Không thể thêm vào danh sách yêu thích!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/wish_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          product_id: product.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsInWishlist(true);
      Alert.alert('Thành công', 'Đã thêm vào danh sách yêu thích!');
    } catch (err) {
      // console.error('Error adding to wishlist:', err);
      Alert.alert('Lỗi', 'Không thể thêm vào danh sách yêu thích!');
    }
  };

  const handleContactSeller = async () => {
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

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Server error ${response.status}: ${responseText.substring(0, 200)}`);
      }

      const convData = JSON.parse(responseText);

      navigation.navigate('(home)/components/ChatScreen', { 
        conversationId: convData.id, 
        sellerName: `${(seller.first_name || '').trim()} ${(seller.last_name || '')}` 
      });
    } catch (err) {
      // console.error('Error creating conversation:', err);
      Alert.alert('Lỗi', `Không thể tạo cuộc trò chuyện! Chi tiết: ${err.message}`);
    }
  };

  // SỬA: Format description sections từ \n\n
  const formattedDescription = () => {
    if (!product.description) return null;
    return product.description.split('\n\n').map((sec, i) => (
      <View key={i} style={detailStyles.descSection}>
        <Text style={detailStyles.descTitle}>Phần {i + 1}</Text>
        <Text style={detailStyles.descText}>{sec}</Text>
      </View>
    ));
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
        {/* SỬA: FlatList horizontal cho multiple images + dots */}
        <View style={detailStyles.imagesContainer}>
          <FlatList
            data={product.images || []}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image 
                source={{ uri: item || 'https://via.placeholder.com/300' }} 
                style={detailStyles.imageItem} 
              />
            )}
            ListEmptyComponent={
              <Image 
                source={{ uri: 'https://via.placeholder.com/300' }} 
                style={detailStyles.imageItem} 
              />
            }
            onScroll={onImageScroll}
            scrollEventThrottle={16}
          />
          {/* Dots indicator */}
          <View style={detailStyles.dotsContainer}>
            {(product.images || []).map((_, index) => (
              <View
                key={index}
                style={[
                  detailStyles.dot,
                  index === currentImageIndex && detailStyles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={detailStyles.content}>
          <Text style={detailStyles.name}>{product.name}</Text>
          <View style={detailStyles.priceContainer}>
            <Text style={detailStyles.price}>{(currentPrice || 0).toLocaleString()}₫</Text>
            {selectedVariant && (
              <View style={detailStyles.priceBadge}>
                <Text style={detailStyles.priceBadgeText}>Đã chọn</Text>
              </View>
            )}
          </View>

          {product.category_name && (
            <Text style={detailStyles.category}>
              Danh mục: {product.category_name}
            </Text>
          )}

          {/* Section seller: Cải thiện */}
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
                  <View style={[detailStyles.sellerAvatar, { backgroundColor: '#E5C9C4', justifyContent: 'center', alignItems: 'center' }]}>
                    <Icon name="person" size={24} color="#8D6E63" />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={detailStyles.sellerName}>
                    {`${(seller.first_name || '').trim()} ${(seller.last_name || '')}` || 'Người bán ẩn danh'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* SỬA: Sections cho size/color từ variants */}
          {availableSizes.length > 0 && (
            <View style={detailStyles.section}>
              <Text style={detailStyles.sectionTitle}>Kích cỡ</Text>
              {renderSelector(availableSizes, setSelectedSize, selectedSize)}
            </View>
          )}

          {availableColors.length > 0 && (
            <View style={detailStyles.section}>
              <Text style={detailStyles.sectionTitle}>Màu sắc</Text>
              {renderSelector(availableColors, setSelectedColor, selectedColor)}
            </View>
          )}

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
            {formattedDescription()}
          </View>

          {currentStock > 0 && (
            <Text style={detailStyles.stockInfo}>
              Còn lại: {currentStock} sản phẩm
            </Text>
          )}

          {/* THÊM: Row icons dưới cùng */}
          <View style={detailStyles.actionRow}>
            {/* Contact Seller Icon */}
            <TouchableOpacity
              style={[
                detailStyles.actionIconButton,
                !seller && detailStyles.actionIconDisabled
              ]}
              onPress={handleContactSeller}
              disabled={!seller}
            >
              <Icon name="chatbubble-outline" style={detailStyles.actionIcon} />
            </TouchableOpacity>

            {/* Add to Cart Icon */}
            <TouchableOpacity
              style={[
                detailStyles.actionIconButton,
                (!selectedVariant || currentStock === 0) && detailStyles.actionIconDisabled
              ]}
              onPress={handleAddToCart}
              disabled={!selectedVariant || currentStock === 0}
            >
              <Icon name="cart-outline" style={detailStyles.actionIcon} />
            </TouchableOpacity>

            {/* Wishlist Icon */}
            <TouchableOpacity
              style={[
                detailStyles.actionIconButton,
                !isSignedIn && detailStyles.actionIconDisabled
              ]}
              onPress={handleAddToWishlist}
              disabled={!isSignedIn}
            >
              <Icon 
                name={isInWishlist ? "heart" : "heart-outline"} 
                style={detailStyles.actionIcon} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}