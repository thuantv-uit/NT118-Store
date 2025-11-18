import { useUser } from '@clerk/clerk-expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
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
import { useChatApi } from '../../../hooks/useChatApi';
import { colors } from '../../../theme/colors';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.7;

const detailStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background.secondary },
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
    backgroundColor: colors.overlay.white90,
    borderRadius: 20,
    padding: 8,
  },
  backButton: { fontSize: 24, color: colors.text.secondary },
  image: {
    width: width,
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
    backgroundColor: colors.background.primary,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  name: { fontSize: 20, fontWeight: '700', color: colors.text.secondary, marginBottom: 4 },
  price: { fontSize: 18, fontWeight: '700', color: colors.accent.red, marginBottom: 16 },
  section: {
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text.secondary, marginBottom: 12 },
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
    borderColor: colors.border.light,
    marginRight: 8,
    marginBottom: 8,
  },
  selectorText: { fontSize: 14, color: colors.text.secondary },
  activeSelector: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  activeText: { color: colors.text.white },
  description: { fontSize: 14, color: colors.text.light, lineHeight: 20 },
  addButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  addText: { fontSize: 16, fontWeight: '700', color: colors.text.white },
  chatButton: {
    borderWidth: 1,
    borderColor: colors.primary.main,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  chatButtonDisabled: {
    opacity: 0.6,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.main,
  },
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
  errorText: { color: colors.status.error, marginBottom: 10 },
  retryButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: colors.text.white, fontWeight: 'bold' },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: 20,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    minWidth: 30,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.secondary,
    gap: 12,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary.rose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary.dark,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sellerSubtitle: {
    fontSize: 12,
    color: colors.text.light,
    marginTop: 2,
  },
});

const API_BASE_URL = API_URL;

export default function ProductDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = route.params || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);

  // Mock detail
  const details = {
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Trắng', 'Đen', 'Xanh'],
  };

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Trắng');
  const [quantity, setQuantity] = useState(1);

  // Get user from Clerk
  const { user, isSignedIn } = useUser();
  const { startConversationWithSeller } = useChatApi();
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
        setProduct({
          ...data,
          name: data.name || 'Sản phẩm không tên',
          description: data.description || 'Không có mô tả.',
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Funtion check customer exsit
  const checkCustomerExists = async () => {
    if (!customerId) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để tiếp tục!');
      // Cant navigate from sign in if need
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
      console.error('Error checking customer:', err);
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

  // Funtion update quantity
  const updateQuantity = (newQty) => {
    if (newQty < 1) newQty = 1; // Don't allow quantity < 1
    setQuantity(newQty);
  };

  // Function add into cart (call check customer priority)
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
      console.log('Added to cart:', newCartItem);
      Alert.alert('Thành công', `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      setQuantity(1);
    } catch (err) {
      console.error('Error adding to cart:', err);
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng!');
    }
  };

  const handleChatWithSeller = async () => {
    if (!isSignedIn) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để trò chuyện với người bán.');
      return;
    }

    if (!sellerAccountId) {
      Alert.alert('Thông báo', 'Sản phẩm chưa có thông tin người bán.');
      return;
    }

    if (sellerAccountId === customerId) {
      Alert.alert('Thông báo', 'Bạn đang xem sản phẩm của chính mình.');
      return;
    }

    try {
      setChatLoading(true);
      const conversation = await startConversationWithSeller(product.id);
      router.push({
        pathname: '/(buyer)/chat/[conversationId]',
        params: { conversationId: conversation.id },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể mở cuộc trò chuyện.';
      Alert.alert('Lỗi', message);
    } finally {
      setChatLoading(false);
    }
  };

  const sellerAccountId = product ? product.seller_id || product.customer_id : null;
  const sellerName = product
    ? `${product.seller_last_name || ''} ${product.seller_first_name || ''}`.trim() ||
      'Người bán'
    : '';
  const sellerInitial = sellerName ? sellerName.charAt(0).toUpperCase() : 'N';
  const canChatWithSeller = Boolean(
    sellerAccountId && sellerAccountId !== customerId
  );

  if (loading) {
    return (
      <SafeAreaView style={detailStyles.safe}>
        <View style={detailStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
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
            <Text style={{ fontSize: 14, color: colors.text.lighter, marginBottom: 16 }}>
              Danh mục: {product.category_name}
            </Text>
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

          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Người bán</Text>
            <View style={detailStyles.sellerCard}>
              {product?.seller_avatar ? (
                <Image
                  source={{ uri: product.seller_avatar }}
                  style={[detailStyles.sellerAvatar, { borderRadius: 24 }]}
                />
              ) : (
                <View style={detailStyles.sellerAvatar}>
                  <Text style={detailStyles.sellerAvatarText}>{sellerInitial}</Text>
                </View>
              )}
              <View style={detailStyles.sellerInfo}>
                <Text style={detailStyles.sellerName}>{sellerName}</Text>
                <Text style={detailStyles.sellerSubtitle}>
                  {canChatWithSeller ? 'Trò chuyện trực tiếp với người bán' : 'Bạn là người bán sản phẩm này'}
                </Text>
              </View>
            </View>
          </View>

          {product.stock !== undefined && (
            <Text style={{ fontSize: 12, color: colors.status.success, marginBottom: 20 }}>
              Còn lại: {product.stock} sản phẩm
            </Text>
          )}

          <TouchableOpacity
            style={[
              detailStyles.chatButton,
              (!canChatWithSeller || chatLoading) && detailStyles.chatButtonDisabled,
            ]}
            onPress={handleChatWithSeller}
            disabled={!canChatWithSeller || chatLoading}
          >
            {chatLoading ? (
              <ActivityIndicator color={colors.primary.main} />
            ) : (
              <>
                <Icon name="chatbubble-ellipses-outline" size={20} color={colors.primary.main} />
                <Text style={detailStyles.chatButtonText}>Nhắn với người bán</Text>
              </>
            )}
          </TouchableOpacity>

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
