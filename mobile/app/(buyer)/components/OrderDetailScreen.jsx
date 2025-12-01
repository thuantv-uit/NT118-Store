// OrderDetailScreen.jsx
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../constants/api';
import { buyerStyles } from '../styles/BuyerStyles';

const API_BASE_URL = API_URL;

// Hàm helper để lấy chi tiết order status theo ID
const fetchOrderStatusById = async (statusId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order_status/${statusId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch order status: ${response.status}`);
    }
    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error('Error fetching order status by ID:', error);
    throw error;
  }
};

// Hàm helper để lấy product info theo product_id (bao gồm variants)
const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`);
    if (!response.ok) {
      return { name: 'Sản phẩm không xác định', price: 0, variants: [] };
    }
    const product = await response.json();
    return product || { name: 'Sản phẩm không xác định', price: 0, variants: [] };
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return { name: 'Sản phẩm không xác định', price: 0, variants: [] };
  }
};

export default function OrderDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { statusId } = route.params || {};
  const [status, setStatus] = useState(null);
  const [product, setProduct] = useState({ name: 'Sản phẩm không xác định', price: 0, variants: [] });
  const [variant, setVariant] = useState(null); // SỬA: Thêm variant state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!statusId) {
      setError('Không tìm thấy ID trạng thái đơn hàng!');
      setLoading(false);
      return;
    }

    const loadDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch status chi tiết
        const statusData = await fetchOrderStatusById(statusId);
        setStatus(statusData);

        // Fetch product info
        if (statusData?.product_id) {
          const productData = await fetchProductById(statusData.product_id);
          setProduct(productData);

          // SỬA: Match variant nếu có variant_id từ status
          if (statusData.variant_id && productData.variants) {
            const matchingVariant = productData.variants.find(v => v.id === statusData.variant_id);
            setVariant(matchingVariant || null);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [statusId]);

  // Timeline steps cho icon và màu (giữ nguyên)
  const statusSteps = {
    pending: { label: 'Chờ xác nhận', icon: 'time-outline', color: '#FF6B00' },
    processing: { label: 'Đang xử lý', icon: 'construct-outline', color: '#FFA500' },
    shipped: { label: 'Đang giao', icon: 'airplane-outline', color: '#00A651' },
    delivered: { label: 'Đã nhận', icon: 'checkmark-circle-outline', color: '#00A651' },
    cancelled: { label: 'Đã hủy', icon: 'close-circle-outline', color: '#FF4D4F' },
  };

  const step = status ? statusSteps[status.status] || { label: status.status, icon: 'help-outline', color: '#999' } : null;

  if (loading) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#6D4C41" />
            </TouchableOpacity>
            <Text style={buyerStyles.headerTitle}>Chi tiết đơn hàng</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#6D4C41" />
            <Text style={{ marginTop: 10 }}>Đang tải...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#6D4C41" />
            </TouchableOpacity>
            <Text style={buyerStyles.headerTitle}>Chi tiết đơn hàng</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red' }}>Lỗi: {error || 'Không tìm thấy đơn hàng'}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={buyerStyles.safe}>
      <View style={buyerStyles.container}>
        <View style={buyerStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#6D4C41" />
          </TouchableOpacity>
          <Text style={buyerStyles.headerTitle}>Chi tiết đơn hàng</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={{ flex: 1, padding: 16 }}>
          {/* Trạng thái */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: step.color,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon name={step.icon} size={28} color="#FFF" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: step.color, marginTop: 8 }}>{step.label}</Text>
          </View>

          {/* Thông tin sản phẩm - SỬA: Hiển thị variant nếu có */}
          <View style={{ backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Sản phẩm</Text>
            <Text style={{ fontSize: 14, marginBottom: 4 }}>Tên: {product.name}</Text>
            {variant && (
              <View style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 14, marginBottom: 2 }}>Kích cỡ: {variant.size} | Màu: {variant.color}</Text>
              </View>
            )}
            <Text style={{ fontSize: 14, color: '#00A651' }}>Giá: {parseFloat(variant?.price || product.price || 0).toLocaleString('vi-VN')} VNĐ</Text>
          </View>

          {/* Vị trí hiện tại */}
          {status.current_location && (
            <View style={{ backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Vị trí hiện tại</Text>
              <Text style={{ fontSize: 14, color: '#00A651' }}>{status.current_location}</Text>
            </View>
          )}

          {/* Thời gian */}
          <View style={{ backgroundColor: '#FFF', padding: 16, borderRadius: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Thời gian</Text>
            <Text style={{ fontSize: 14, marginBottom: 4 }}>Tạo: {new Date(status.created_at).toLocaleString('vi-VN')}</Text>
            <Text style={{ fontSize: 14 }}>Cập nhật: {new Date(status.updated_at).toLocaleString('vi-VN')}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}