import { useUser } from '@clerk/clerk-expo'; // Import useUser từ Clerk
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { API_URL } from '../../../constants/api';
import SellerScreenLayout from '../components/SellerScreenLayout';

const API_BASE = API_URL; // Cập nhật URL API

// Mapping trạng thái sang text tiếng Việt và màu sắc
const STATUS_MAP = {
  pending: { text: 'Chờ Xử Lý', color: '#FFA500', bgColor: '#FFE5CC' },
  processing: { text: 'Đang Xử Lý', color: '#FFD700', bgColor: '#FFF3CD' },
  shipped: { text: 'Đang Giao', color: '#87CEEB', bgColor: '#E3F2FD' },
  delivered: { text: 'Đã Giao', color: '#32CD32', bgColor: '#D4EDDA' },
  cancelled: { text: 'Đã Hủy', color: '#FF4500', bgColor: '#F8D7DA' },
};

export default function SellerOrders() {
  const router = useRouter();
  const { user } = useUser(); // Lấy user từ Clerk
  const sellerId = user?.id; // seller_id = user.id từ Clerk (ví dụ: "user_35gprixG7cR55EdZ1JBL3L8MKYp")

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (sellerId) {
      loadOrders();
    }
  }, [sellerId]); // Chạy khi sellerId thay đổi (sau khi user load)

  useEffect(() => {
    let filtered = orders;
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.order_id.toString().includes(searchQuery)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  const loadOrders = async (filterStatus = '') => {
    if (!sellerId) {
      Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
      return;
    }

    try {
      setLoading(true);
      let url = `${API_BASE}/order_status/seller/${sellerId}`;
      // Nếu backend hỗ trợ query param, thêm ?status=${filterStatus}; nếu không, filter frontend như hiện tại
      const response = await fetch(url);
      if (!response.ok) throw new Error('Lỗi tải dữ liệu');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Lỗi load orders:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    if (!sellerId) {
      Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/order_status/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, seller_id: sellerId }),
      });
      if (!response.ok) throw new Error('Lỗi cập nhật');
      Alert.alert('Thành công', 'Cập nhật trạng thái đơn hàng thành công');
      setModalVisible(false);
      loadOrders(); // Reload data
    } catch (error) {
      console.error('Lỗi update status:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái');
    }
  };

  const openUpdateModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setModalVisible(true);
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderRow}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>#{item.order_id}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.product_id} (Sản phẩm)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.buyer_id}</Text>
      </View>
      <View style={styles.cell}>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_MAP[item.status]?.bgColor }]}>
          <Text style={[styles.statusText, { color: STATUS_MAP[item.status]?.color }]}>
            {STATUS_MAP[item.status]?.text}
          </Text>
        </View>
      </View>
      <View style={styles.cell}>
        <Pressable
          style={styles.updateBtn}
          onPress={() => openUpdateModal(item)}
          accessibilityRole="button"
          accessibilityLabel="Cập nhật trạng thái"
        >
          <Text style={styles.updateBtnText}>Cập Nhật</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm đơn hàng..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        accessibilityLabel="Tìm kiếm"
      />
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Lọc theo trạng thái:</Text>
        <Pressable style={styles.filterBtn} onPress={() => setStatusFilter('')}>
          <Text style={styles.filterBtnText}>
            {statusFilter ? STATUS_MAP[statusFilter]?.text || statusFilter : 'Tất cả'}
          </Text>
          <Ionicons name="chevron-down" size={hp('1.8%')} color="#666" />
        </Pressable>
        {/* Để mở rộng filter, có thể dùng Picker hoặc Modal riêng */}
      </View>
    </View>
  );

  if (loading || !sellerId) {
    return (
      <SellerScreenLayout title="Quản Lý Đơn Hàng" subtitle="Theo dõi và cập nhật trạng thái">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EE4D2D" />
          <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
        </View>
      </SellerScreenLayout>
    );
  }

  return (
    <SellerScreenLayout title="Quản Lý Đơn Hàng" subtitle="Theo dõi và cập nhật trạng thái">
      {/* Fix: Sử dụng ScrollView thay vì FlatList tạm thời để tránh nested VirtualizedList */}
      {/* Nếu data nhiều, quay lại FlatList sau khi fix SellerScreenLayout */}
      <ScrollView 
        style={styles.scrollViewContainer}
        nestedScrollEnabled={true} // Hỗ trợ nested scroll
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        <View style={styles.listContainer}>
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={hp('8%')} color="#CCC" />
              <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
            </View>
          ) : (
            filteredOrders.map((item) => React.cloneElement(renderOrderItem({ item }), { key: item.id.toString() }))
          )}
        </View>
      </ScrollView>

      {/* Modal Cập Nhật Trạng Thái */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cập Nhật Trạng Thái</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={hp('2.5%')} color="#666" />
              </Pressable>
            </View>
            <Text style={styles.modalOrderId}>Đơn hàng: #{selectedOrder?.order_id}</Text>
            <Text style={styles.modalLabel}>Trạng thái mới:</Text>
            <Pressable
              style={styles.statusOption}
              onPress={() => setNewStatus('pending')}
            >
              <View style={[styles.statusCircle, newStatus === 'pending' && styles.statusCircleSelected]} />
              <Text style={styles.statusOptionText}>Chờ Xử Lý</Text>
            </Pressable>
            <Pressable
              style={styles.statusOption}
              onPress={() => setNewStatus('processing')}
            >
              <View style={[styles.statusCircle, newStatus === 'processing' && styles.statusCircleSelected]} />
              <Text style={styles.statusOptionText}>Đang Xử Lý</Text>
            </Pressable>
            <Pressable
              style={styles.statusOption}
              onPress={() => setNewStatus('shipped')}
            >
              <View style={[styles.statusCircle, newStatus === 'shipped' && styles.statusCircleSelected]} />
              <Text style={styles.statusOptionText}>Đang Giao</Text>
            </Pressable>
            <Pressable
              style={styles.statusOption}
              onPress={() => setNewStatus('delivered')}
            >
              <View style={[styles.statusCircle, newStatus === 'delivered' && styles.statusCircleSelected]} />
              <Text style={styles.statusOptionText}>Đã Giao</Text>
            </Pressable>
            <Pressable
              style={styles.statusOption}
              onPress={() => setNewStatus('cancelled')}
            >
              <View style={[styles.statusCircle, newStatus === 'cancelled' && styles.statusCircleSelected]} />
              <Text style={styles.statusOptionText}>Đã Hủy</Text>
            </Pressable>
            <Pressable
              style={styles.saveBtn}
              onPress={() => updateStatus(selectedOrder?.id, newStatus)}
            >
              <Text style={styles.saveBtnText}>Lưu Thay Đổi</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SellerScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: hp('2%'),
    color: '#666',
  },
  header: {
    backgroundColor: '#FFF',
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.2%'),
    marginBottom: hp('1.5%'),
    fontSize: hp('1.8%'),
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: hp('1.6%'),
    color: '#666',
    flex: 1,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    borderRadius: 6,
    marginLeft: wp('2%'),
  },
  filterBtnText: {
    fontSize: hp('1.6%'),
    color: '#333',
    marginRight: wp('1%'),
  },
  listContainer: {
    padding: wp('4%'),
  },
  orderRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: hp('1.5%'),
    marginBottom: hp('1.5%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: hp('1.8%'),
    color: '#333',
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 20,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: hp('1.5%'),
    fontWeight: '600',
  },
  updateBtn: {
    backgroundColor: '#EE4D2D',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: 6,
    alignSelf: 'center',
  },
  updateBtnText: {
    color: '#FFF',
    fontSize: hp('1.6%'),
    fontWeight: '600',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('10%'),
  },
  emptyText: {
    marginTop: hp('2%'),
    fontSize: hp('2%'),
    color: '#CCC',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: wp('5%'),
    width: wp('85%'),
    maxHeight: hp('60%'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalTitle: {
    fontSize: hp('2.2%'),
    fontWeight: '700',
    color: '#EE4D2D',
    flex: 1,
  },
  closeBtn: {
    padding: wp('1%'),
  },
  modalOrderId: {
    fontSize: hp('1.8%'),
    color: '#666',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: hp('1.8%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  statusCircle: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 2,
    borderColor: '#DDD',
    marginRight: wp('3%'),
  },
  statusCircleSelected: {
    backgroundColor: '#EE4D2D',
    borderColor: '#EE4D2D',
  },
  statusOptionText: {
    fontSize: hp('1.8%'),
    color: '#333',
    flex: 1,
  },
  saveBtn: {
    backgroundColor: '#EE4D2D',
    paddingVertical: hp('1.5%'),
    borderRadius: 8,
    marginTop: hp('2%'),
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: hp('1.8%'),
    fontWeight: '700',
  },
});