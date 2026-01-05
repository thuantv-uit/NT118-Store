import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from 'react-native-vector-icons';
import { API_URL } from '../../../constants/api';
import { buyerStyles } from '../_styles/BuyerStyles';

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

// Hàm helper để lấy user info (buyer/seller/shipper)
const fetchUserInfo = async (userId) => {
  if (!userId) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${userId}`);
    if (!response.ok) {
      console.warn(`Failed to fetch user ${userId}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    return {
      first_name: data.first_name || data.firstname || undefined,
      last_name: data.last_name || data.lastname || undefined,
      phone: data.phone_number || data.phone || undefined,
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};

// SỬA: Helper để lấy product info theo product_id (bao gồm variants, handle price fallback)
const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`);
    if (!response.ok) {
      return { name: 'Sản phẩm không xác định', price: 0, variants: [] };
    }
    const product = await response.json();
    // console.log("data product: ", product); // Giữ để debug nếu cần

    // Xử lý variants để lấy price fallback nếu root price null, và color/size mặc định
    let computedPrice = product.price;
    let defaultColor = null;
    let defaultSize = null;
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      if (product.price === null && firstVariant && firstVariant.price) {
        computedPrice = firstVariant.price; // Fallback: lấy price variant đầu tiên
      }
      defaultColor = firstVariant.color;
      defaultSize = firstVariant.size;
    }

    const enrichedProduct = {
      ...product,
      price: computedPrice, // Override với price đã handle
      defaultColor: defaultColor,
      defaultSize: defaultSize,
    };

    return enrichedProduct || { name: 'Sản phẩm không xác định', price: 0, variants: [] };
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return { name: 'Sản phẩm không xác định', price: 0, variants: [] };
  }
};

// SỬA: Helper để match variant từ status (ưu tiên variant_id, fallback match bằng color + size)
const matchVariant = (product, status) => {
  if (!product.variants || !Array.isArray(product.variants)) return null;

  // Ưu tiên match bằng variant_id nếu có
  if (status.variant_id) {
    return product.variants.find(v => v.id === status.variant_id);
  }

  // Fallback: Match bằng color + size nếu có cả hai
  if (status.color && status.size) {
    return product.variants.find(v => 
      (v.color || '').toLowerCase() === (status.color || '').toLowerCase() &&
      (v.size || '').toLowerCase() === (status.size || '').toLowerCase()
    );
  }

  // Nếu chỉ có color hoặc size, match loose hơn (nhưng ưu tiên exact)
  if (status.color) {
    const colorMatch = product.variants.find(v => 
      (v.color || '').toLowerCase() === (status.color || '').toLowerCase()
    );
    if (colorMatch) return colorMatch;
  }
  if (status.size) {
    const sizeMatch = product.variants.find(v => 
      (v.size || '').toLowerCase() === (status.size || '').toLowerCase()
    );
    if (sizeMatch) return sizeMatch;
  }

  // Cuối cùng fallback variant đầu tiên
  return product.variants[0] || null;
};

export default function OrderDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { statusId } = route.params || {};
  const [status, setStatus] = useState(null);
  const [product, setProduct] = useState({ name: 'Sản phẩm không xác định', price: 0, variants: [] });
  const [variant, setVariant] = useState(null); // SỬA: Thêm variant state
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [shipperInfo, setShipperInfo] = useState(null);
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

        // Enrich với user infos
        const [buyerData, sellerData, shipperData] = await Promise.all([
          fetchUserInfo(statusData.buyer_id),
          fetchUserInfo(statusData.seller_id),
          statusData.shipper_id ? fetchUserInfo(statusData.shipper_id) : null,
        ]);

        // Fetch product info
        let productData = { name: 'Sản phẩm không xác định', price: 0, variants: [] };
        let matchingVariant = null;
        if (statusData?.product_id) {
          productData = await fetchProductById(statusData.product_id);

          // SỬA: Match variant nếu có variant_id từ status
          matchingVariant = matchVariant(productData, statusData);
        }

        // Gộp enriched info vào status
        const enrichedStatus = {
          ...statusData,
          buyerInfo: buyerData,
          sellerInfo: sellerData,
          shipperInfo: shipperData,
          productInfo: productData,
          variantInfo: matchingVariant,
        };

        setStatus(enrichedStatus);
        setProduct(productData);
        setVariant(matchingVariant);
        setBuyerInfo(buyerData);
        setSellerInfo(sellerData);
        setShipperInfo(shipperData);
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

  // Helper để hiển thị tên user
  const getUserDisplayName = (userInfo, fallbackId) => {
    if (userInfo && userInfo.first_name && userInfo.last_name) {
      return `${userInfo.first_name} ${userInfo.last_name}`.trim();
    }
    return fallbackId || 'N/A';
  };

  // Helper để hiển thị shipper (với fallback nếu chưa assign)
  const getShipperDisplay = () => {
    if (status.shipper_id && status.shipperInfo) {
      return getUserDisplayName(status.shipperInfo, status.shipper_id);
    }
    return 'Chưa assign người giao hàng';
  };

  if (loading) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#6D4C41" />
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

  if (error || !status) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#6D4C41" />
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
            <Ionicons name="arrow-back" size={24} color="#6D4C41" />
          </TouchableOpacity>
          <Text style={buyerStyles.headerTitle}>Chi tiết đơn hàng</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* SỬA: Wrap nội dung vào ScrollView để enable scroll khi content dài */}
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ padding: 16 }} 
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
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
              <Ionicons name={step.icon} size={28} color="#FFF" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: step.color, marginTop: 8 }}>{step.label}</Text>
          </View>

          {/* Mã đơn hàng */}
          <View style={{ backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Mã Đơn Hàng</Text>
            <Text style={{ fontSize: 14 }}>#{status.order_id}</Text>
          </View>

          {/* Thông tin sản phẩm - SỬA: Hiển thị variant nếu có, quantity nếu có */}
          <View style={{ backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Sản phẩm</Text>
            <Text style={{ fontSize: 14, marginBottom: 4 }}>Tên: {status.productInfo?.name || 'N/A'}</Text>
            {status.quantity && (
              <Text style={{ fontSize: 14, marginBottom: 4 }}>Số lượng: {status.quantity}</Text>
            )}
            {(status.color || status.productInfo?.defaultColor || variant?.color) && (
              <Text style={{ fontSize: 14, marginBottom: 4 }}>
                Màu sắc: {status.color || status.productInfo?.defaultColor || variant?.color || 'N/A'}
              </Text>
            )}
            {(status.size || status.productInfo?.defaultSize || variant?.size) && (
              <Text style={{ fontSize: 14, marginBottom: 4 }}>
                Kích cỡ: {status.size || status.productInfo?.defaultSize || variant?.size || 'N/A'}
              </Text>
            )}
            <Text style={{ fontSize: 14, color: '#00A651' }}>
              Giá: {parseFloat(variant?.price || status.productInfo?.price || 0).toLocaleString('vi-VN')} VNĐ
            </Text>
          </View>

          {/* Thông tin người dùng */}
          <View style={{ backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Thông tin người dùng</Text>
            <Text style={{ fontSize: 14, marginBottom: 4 }}>
              Khách hàng: {getUserDisplayName(status.buyerInfo, status.buyer_id)}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 4 }}>
              Seller: {getUserDisplayName(status.sellerInfo, status.seller_id)}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 4 }}>
              Người giao hàng: {getShipperDisplay()}
            </Text>
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
            <Text style={{ fontSize: 14, marginBottom: 4 }}>
              Tạo: {new Date(status.created_at).toLocaleString('vi-VN')}
            </Text>
            <Text style={{ fontSize: 14 }}>
              Cập nhật: {new Date(status.updated_at).toLocaleString('vi-VN')}
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
