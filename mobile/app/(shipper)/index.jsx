import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../constants/api';
import OrderDetailModal from './components/OrderDetailModal';
import OrderItem from './components/OrderItem';
import UpdateLocationModal from './components/UpdateLocationModal';
import UpdateStatusModal from './components/UpdateStatusModal';
import { shipperStyles } from './styles/shipperStyles';

const API_BASE_URL = API_URL;

const fetchShipperOrders = async (shipperId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order_status/shipper/${shipperId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shipper orders: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data.filter(Boolean) : [data].filter(Boolean);
  } catch (error) {
    console.error('Error fetching shipper orders:', error);
    throw error;
  }
};

const fetchUserRole = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user role: ${response.status}`);
    }
    const userData = await response.json();
    return userData.role;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
};

const fetchBuyerInfo = async (buyerId) => {
  if (!buyerId) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${buyerId}`);
    if (!response.ok) {
      console.warn(`Failed to fetch buyer ${buyerId}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    const buyerInfo = {
      firstname: data.first_name || data.firstname || undefined,
      lastname: data.last_name || data.lastname || undefined,
      phone: data.phone_number || data.phone || undefined,
      email: data.email || undefined,
      avatar: data.avatar || data.avatar_url || undefined,
    };
    return buyerInfo;
  } catch (error) {
    console.error('Error fetching buyer info:', error);
    return null;
  }
};

const fetchProductInfo = async (productId) => {
  if (!productId) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`);
    if (!response.ok) {
      console.warn(`Failed to fetch product ${productId}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    // console.log("data product: ", data); // Giữ nguyên để debug

    // Xử lý variants để lấy price fallback nếu root price null
    let productPrice = data.price;
    let totalStock = data.stock || 0;
    let variantsSummary = []; // Optional: summary variants nếu cần (ví dụ cho detail modal)

    if (data.variants && Array.isArray(data.variants) && data.price === null) {
      const firstVariant = data.variants[0];
      if (firstVariant && firstVariant.price) {
        productPrice = firstVariant.price; // Fallback: lấy price variant đầu tiên
      }
      // Optional: Tính tổng stock từ variants
      totalStock = data.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
      // Optional: Lưu summary variants (ví dụ [{color, size, price, stock}])
      variantsSummary = data.variants.map(v => ({
        color: v.color,
        size: v.size,
        price: v.price,
        stock: v.stock
      }));
    }

    const productInfo = {
      name: data.name || data.product_name || undefined,
      image: data.images?.[0] || data.image || data.image_url || undefined, // Ưu tiên array[0]
      price: productPrice, // Đã handle fallback
      description: data.description || undefined, // Thêm nếu OrderItem cần
      stock: totalStock, // Tổng stock (root + variants)
      variants: variantsSummary || undefined, // Optional cho detail
      sku: data.sku || undefined, // Thêm nếu cần
    };
    return productInfo;
  } catch (error) {
    console.error('Error fetching product info:', error);
    return null;
  }
};

const fetchOrderInfo = async (orderId) => {
  if (!orderId) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/order/${orderId}`);
    if (!response.ok) {
      console.warn(`Failed to fetch order ${orderId}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    const orderInfo = {
      shipment_id: data.shipment_id || undefined,
    };
    return orderInfo;
  } catch (error) {
    console.error('Error fetching order info:', error);
    return null;
  }
};

const fetchShipmentInfo = async (shipmentId) => {
  if (!shipmentId) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/shipment/${shipmentId}`);
    if (!response.ok) {
      console.warn(`Failed to fetch shipment ${shipmentId}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    const shipmentInfo = {
      address: data.address || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
      country: data.country || undefined,
    };
    return shipmentInfo;
  } catch (error) {
    console.error('Error fetching shipment info:', error);
    return null;
  }
};

export default function ShipperScreen() {
  const navigation = useNavigation();
  const { user, isLoaded } = useUser();
  const shipperId = user?.id;

  const [orders, setOrders] = useState([]);
  const [enrichedOrders, setEnrichedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      setLoading(true);
      return;
    }

    if (!shipperId) {
      setError('Không tìm thấy ID shipper! Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    const initializeShipper = async () => {
      try {
        const role = await fetchUserRole(shipperId);
        setUserRole(role);

        if (role !== 'shipper') {
          setError('Bạn không có quyền truy cập vào trang Shipper. Vui lòng kiểm tra vai trò của bạn.');
          setLoading(false);
          Alert.alert(
            'Không có quyền truy cập',
            'Bạn không phải là Shipper. Đang quay lại...',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
          return;
        }

        await loadOrders();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeShipper();
  }, [isLoaded, shipperId]);

  const loadOrders = async () => {
    if (!shipperId || userRole !== 'shipper') {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const shipperOrders = await fetchShipperOrders(shipperId);
      
      // Enrich orders with buyerInfo, productInfo, orderInfo, và shipmentInfo nếu có shipment_id
      const enriched = await Promise.all(
        shipperOrders.map(async (order) => {
          if (!order) return null;
          const [buyerInfo, productInfo, orderInfo] = await Promise.all([
            fetchBuyerInfo(order.buyer_id),
            fetchProductInfo(order.product_id),
            fetchOrderInfo(order.order_id)
          ]);
          let shipmentInfo = null;
          if (orderInfo?.shipment_id) {
            shipmentInfo = await fetchShipmentInfo(orderInfo.shipment_id);
          }
          return { ...order, buyerInfo, productInfo, orderInfo, shipmentInfo };
        })
      );
      const validEnriched = enriched.filter(Boolean);
      setOrders(shipperOrders.filter(Boolean));
      setEnrichedOrders(validEnriched);
    } catch (err) {
      setError(err.message);
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = (order) => {
    if (userRole !== 'shipper' || !order) {
      console.warn('handleUpdateLocation: Invalid order or role');
      return;
    }
    if (!order.id) {
      console.error("ERROR: orderStatusId is undefined! Check API response structure.");
      return;
    }
    setSelectedOrder(order);
    setShowLocationModal(true);
  };

  const handleUpdateStatus = (order) => {
    if (userRole !== 'shipper' || !order) {
      console.warn('handleUpdateStatus: Invalid order or role');
      return;
    }
    if (!order.id) {
      console.error("ERROR: orderStatusId is undefined!");
      return;
    }
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handlePressDetail = (order) => {
    if (!order) {
      console.warn('handlePressDetail: Invalid order');
      return;
    }
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleRefresh = () => {
    if (shipperId && userRole === 'shipper') {
      loadOrders();
    }
  };

  if (loading || !isLoaded) {
    return (
      <SafeAreaView style={shipperStyles.safe}>
        <View style={shipperStyles.container}>
          <View style={shipperStyles.header}>
            <Text style={shipperStyles.headerTitle}>Bảng điều khiển Shipper</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={shipperStyles.loadingText}>Đang tải...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error || userRole !== 'shipper') {
    return (
      <SafeAreaView style={shipperStyles.safe}>
        <View style={shipperStyles.container}>
          <View style={shipperStyles.header}>
            <Text style={shipperStyles.headerTitle}>Bảng điều khiển Shipper</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={shipperStyles.errorText}>Lỗi: {error || 'Không có quyền truy cập'}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={shipperStyles.retryButton}>
              <Text style={shipperStyles.retryButtonText}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={shipperStyles.safe}>
      <View style={shipperStyles.container}>
        <View style={shipperStyles.header}>
          <Text style={shipperStyles.headerTitle}>Bảng điều khiển Shipper</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={enrichedOrders}
          renderItem={({ item }) => (
            <OrderItem
              order={item}
              onPressDetail={handlePressDetail}
              onUpdateLocation={handleUpdateLocation}
              onUpdateStatus={handleUpdateStatus}
              buyerInfo={item?.buyerInfo}
            />
          )}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          style={shipperStyles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={shipperStyles.headerSection}>
              <Text style={shipperStyles.headerSectionText}>Danh sách đơn hàng ({enrichedOrders.length})</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={shipperStyles.emptyContainer}>
              <Icon name="receipt-outline" size={64} color="#CCC" />
              <Text style={shipperStyles.emptyText}>Chưa có đơn hàng nào</Text>
            </View>
          }
        />

        <TouchableOpacity onPress={handleRefresh} style={shipperStyles.refreshButton}>
          <Icon name="refresh" size={20} color="#FFF" />
          <Text style={shipperStyles.refreshButtonText}>Làm mới</Text>
        </TouchableOpacity>

        <UpdateLocationModal
          visible={showLocationModal}
          orderStatusId={selectedOrder?.id}
          shipperId={shipperId}
          onClose={() => {
            setShowLocationModal(false);
            setSelectedOrder(null);
            handleRefresh();
          }}
        />

        <UpdateStatusModal
          visible={showStatusModal}
          order={selectedOrder}
          shipperId={shipperId}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedOrder(null);
            handleRefresh();
          }}
        />

        <OrderDetailModal
          visible={showDetailModal}
          order={selectedOrder}
          buyerInfo={selectedOrder?.buyerInfo}
          productInfo={selectedOrder?.productInfo}
          orderInfo={selectedOrder?.orderInfo}
          shipmentInfo={selectedOrder?.shipmentInfo}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}
        />
      </View>
    </SafeAreaView>
  );
}