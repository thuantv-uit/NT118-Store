// shipper/index.js - Shipper screen với check role và load orders
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
import OrderItem from './components/OrderItem';
import UpdateLocationModal from './components/UpdateLocationModal';
import { shipperStyles } from './styles/shipperStyles';

const API_BASE_URL = API_URL;

const fetchShipperOrders = async (shipperId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order_status/shipper/${shipperId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shipper orders: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
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

export default function ShipperScreen() {
  const navigation = useNavigation();
  const { user, isLoaded } = useUser();
  const shipperId = user?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      setOrders(shipperOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = (order) => {
    if (userRole !== 'shipper') return;
    if (!order.id) {
      console.error("ERROR: orderStatusId is undefined! Check API response structure.");
      return;
    }
    setSelectedOrder(order);
    setShowModal(true);
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
          data={orders}
          renderItem={({ item }) => (
            <OrderItem
              order={item}
              onUpdateLocation={() => handleUpdateLocation(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          style={shipperStyles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={shipperStyles.headerSection}>
              <Text style={shipperStyles.headerSectionText}>Danh sách đơn hàng ({orders.length})</Text>
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
          visible={showModal}
          orderStatusId={selectedOrder?.id}
          shipperId={shipperId}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
            handleRefresh();
          }}
        />
      </View>
    </SafeAreaView>
  );
}