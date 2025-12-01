import { useUser } from '@clerk/clerk-expo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../constants/api';
import { buyerStyles } from '../styles/BuyerStyles';

const API_BASE_URL = API_URL;

// Hàm helper để lấy order statuses theo buyer_id
const fetchBuyerStatuses = async (buyerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order_status/buyer/${buyerId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch buyer statuses: ${response.status}`);
    }
    const data = await response.json();
    const statuses = Array.isArray(data) ? data : [data];
    // console.log("Debug fetchBuyerStatuses - statuses:", statuses); // Debug
    return statuses;
  } catch (error) {
    console.error('Error fetching buyer statuses:', error);
    throw error;
  }
};

//Helper để lấy product info theo product_id (bao gồm variants, handle price fallback, image từ array)
const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`);
    if (!response.ok) {
      return { id: productId, name: 'Sản phẩm không xác định', price: 0, variants: [], images: [] };
    }
    const product = await response.json();
    // console.log("data product: ", product); // Giữ để debug nếu cần

    // Xử lý variants để lấy price fallback nếu root price null
    let computedPrice = product.price;
    if (product.variants && Array.isArray(product.variants) && product.price === null) {
      const firstVariant = product.variants[0];
      if (firstVariant && firstVariant.price) {
        computedPrice = firstVariant.price; // Fallback: lấy price variant đầu tiên
      }
    }

    // Lấy image đầu tiên từ array nếu có
    const firstImage = product.images && Array.isArray(product.images) ? product.images[0] : product.image || product.image_url || null;

    const enrichedProduct = {
      ...product,
      price: computedPrice, // Override với price đã handle
      image: firstImage, // Thêm image cho display nếu cần (có thể dùng trong OrderDetail)
      // Thêm optional: description: product.description, category_name: product.category_name, sku: product.sku
    };

    return enrichedProduct || { id: productId, name: 'Sản phẩm không xác định', price: 0, variants: [], images: [] };
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return { id: productId, name: 'Sản phẩm không xác định', price: 0, variants: [], images: [] };
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

export default function OrderTrackingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useUser();
  const { buyerId, orderId } = route.params || {}; // Nhận orderId nếu có, nhưng không dùng fetch order
  const fallbackBuyerId = user?.id;
  const currentBuyerId = buyerId || fallbackBuyerId;
  const [statuses, setStatuses] = useState([]);
  const [enrichedStatuses, setEnrichedStatuses] = useState([]); // Statuses với product info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentBuyerId) {
      setError('Không tìm thấy ID người mua!');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch statuses
        const buyerStatuses = await fetchBuyerStatuses(currentBuyerId);
        setStatuses(buyerStatuses);

        // Lấy unique product_ids từ statuses
        const uniqueProductIds = [...new Set(buyerStatuses.map(s => s.product_id))];
        // console.log("Debug uniqueProductIds:", uniqueProductIds); // Debug

        // Fetch products cho từng product_id
        const productPromises = uniqueProductIds.map(id => fetchProductById(id));
        const products = await Promise.all(productPromises);
        const productMap = {};
        products.forEach(product => {
          productMap[product.id] = product;
        });

        // Enrich statuses với product và variant
        const enriched = buyerStatuses.map(status => ({
          ...status,
          product: productMap[status.product_id] || { name: 'Sản phẩm không xác định', price: 0 },
          variant: matchVariant(productMap[status.product_id], status),  // SỬA: Match variant nếu có
        }));
        setEnrichedStatuses(enriched);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentBuyerId]);

  if (loading) {
    return (
      <SafeAreaView style={buyerStyles.safe}>
        <View style={buyerStyles.container}>
          <View style={buyerStyles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#6D4C41" />
            </TouchableOpacity>
            <Text style={buyerStyles.headerTitle}>Theo dõi đơn hàng</Text>
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
            <Text style={buyerStyles.headerTitle}>Theo dõi đơn hàng</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red' }}>Lỗi: {error}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Timeline steps cho icon và màu (giữ nguyên)
  const statusSteps = {
    pending: { label: 'Chờ xác nhận', icon: 'time-outline', color: '#FF6B00' },
    processing: { label: 'Đang xử lý', icon: 'construct-outline', color: '#FFA500' },
    shipped: { label: 'Đang giao', icon: 'airplane-outline', color: '#00A651' },
    delivered: { label: 'Đã nhận', icon: 'checkmark-circle-outline', color: '#00A651' },
    cancelled: { label: 'Đã hủy', icon: 'close-circle-outline', color: '#FF4D4F' },
  };

  const renderStatusItem = ({ item: status }) => {
    const step = statusSteps[status.status] || { label: status.status, icon: 'help-outline', color: '#999' };
    const product = status.product || { name: 'Sản phẩm không xác định', price: 0 };
    const variant = status.variant || {};  // SỬA: Hiển thị variant nếu có
    // SỬA: Sử dụng price đã enriched (từ variant match theo color/size hoặc variant_id, fallback product price)
    const displayPrice = variant.price || product.price || 0;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('(buyer)/components/OrderDetailScreen', { statusId: status.id })}
        activeOpacity={0.7}
      >
        <View style={{ padding: 16, backgroundColor: '#FFF', marginBottom: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: step.color,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Icon name={step.icon} size={20} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: step.color }}>{step.label}</Text>
            <Text style={{ fontSize: 14, marginTop: 4 }}>Sản phẩm: {product.name}</Text>
            {Object.keys(variant).length > 0 && (
              <Text style={{ fontSize: 14, marginTop: 2 }}>Kích cỡ: {variant.size || 'N/A'} | Màu: {variant.color || 'N/A'}</Text>
            )}
            <Text style={{ fontSize: 14, color: '#00A651', marginTop: 2 }}>Giá: {parseFloat(displayPrice).toLocaleString('vi-VN')} VNĐ</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={buyerStyles.safe}>
      <View style={buyerStyles.container}>
        <View style={buyerStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#6D4C41" />
          </TouchableOpacity>
          <Text style={buyerStyles.headerTitle}>Theo dõi đơn hàng</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={enrichedStatuses} // Hiển thị enriched statuses với product info
          renderItem={renderStatusItem}
          keyExtractor={(item) => item.id.toString()}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Trạng thái đơn hàng</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>Tổng {enrichedStatuses.length} mục</Text>
            </View>
          }
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Không có dữ liệu</Text>}
        />

        {/* Nút làm mới - SỬA: Thêm logic refresh */}
        <TouchableOpacity
          onPress={() => {
            // Gọi lại loadData để refresh
            const loadData = async () => {
              try {
                setLoading(true);
                setError(null);
                const buyerStatuses = await fetchBuyerStatuses(currentBuyerId);
                setStatuses(buyerStatuses);
                const uniqueProductIds = [...new Set(buyerStatuses.map(s => s.product_id))];
                const productPromises = uniqueProductIds.map(id => fetchProductById(id));
                const products = await Promise.all(productPromises);
                const productMap = {};
                products.forEach(product => {
                  productMap[product.id] = product;
                });
                const enriched = buyerStatuses.map(status => ({
                  ...status,
                  product: productMap[status.product_id] || { name: 'Sản phẩm không xác định', price: 0 },
                  variant: matchVariant(productMap[status.product_id], status),
                }));
                setEnrichedStatuses(enriched);
              } catch (err) {
                setError(err.message);
              } finally {
                setLoading(false);
              }
            };
            loadData();
          }}
          style={{ padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0E0E0' }}
        >
          <Text style={{ color: '#6D4C41' }}>Làm mới</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}