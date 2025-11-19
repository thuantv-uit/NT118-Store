// OrderTrackingScreen.jsx - Cập nhật: Bỏ call API order, fetch product từ product_id trong statuses
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
    const statuses = Array.isArray(data) ? data : [data]; // Handle nếu là object đơn lẻ
    // console.log("Debug fetchBuyerStatuses - statuses:", statuses); // Debug
    return statuses;
  } catch (error) {
    console.error('Error fetching buyer statuses:', error);
    throw error;
  }
};

// Hàm helper để lấy product info theo product_id
const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`);
    if (!response.ok) {
      return { id: productId, name: 'Sản phẩm không xác định', price: 0 }; // Fallback
    }
    const product = await response.json();
    return product || { id: productId, name: 'Sản phẩm không xác định', price: 0 };
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return { id: productId, name: 'Sản phẩm không xác định', price: 0 };
  }
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

        // Enrich statuses với product info
        const enriched = buyerStatuses.map(status => ({
          ...status,
          product: productMap[status.product_id] || { name: 'Sản phẩm không xác định', price: 0 },
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

  if (enrichedStatuses.length === 0) {
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
            <Text>Chưa có đơn hàng nào!</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Timeline steps
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
    return (
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
          <Text style={{ fontSize: 14, color: '#00A651', marginTop: 2 }}>Giá: {parseFloat(product.price || 0).toLocaleString('vi-VN')} VNĐ</Text>
          <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Đơn hàng #{status.order_id} - Sản phẩm ID: {status.product_id}</Text>
          <Text style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
            Seller: {status.seller_id.slice(0, 8)}... | Cập nhật: {new Date(status.updated_at).toLocaleString('vi-VN')}
          </Text>
        </View>
      </View>
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

        {/* Nút làm mới */}
        <TouchableOpacity
          onPress={() => {/* Gọi lại loadData */}}
          style={{ padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0E0E0' }}
        >
          <Text style={{ color: '#6D4C41' }}>Làm mới</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}