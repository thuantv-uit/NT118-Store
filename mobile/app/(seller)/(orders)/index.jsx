import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
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
  const sellerId = user?.id; // seller_id = user.id từ Clerk

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const loadOrders = async () => {
    if (!sellerId) {
      Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
      return;
    }

    try {
      setLoading(true);
      let url = `${API_BASE}/order_status/seller/${sellerId}`;
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

  const handleOrderPress = (order) => {
    router.push({
      pathname: '/(seller)/(orders)/[id]',
      params: { id: order.id.toString() },
    });
  };

  const renderOrderItem = (item, index) => (
    <TouchableOpacity  // Thay Pressable bằng TouchableOpacity
      key={item.id.toString()}
      style={styles.orderRow}
      onPress={() => handleOrderPress(item)}
      activeOpacity={0.7}  // Feedback khi press
      accessibilityRole="button"
      accessibilityLabel={`Xem chi tiết đơn hàng ${item.order_id}`}
    >
      <View style={styles.cell}>
        <Text style={styles.cellText}>#{item.order_id}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.product_id}</Text>
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
    </TouchableOpacity>
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
    </View>
  );

  if (loading || !sellerId) {
    return (
      <SellerScreenLayout title="Quản Lý Đơn Hàng" subtitle="Danh sách đơn hàng">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EE4D2D" />
          <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
        </View>
      </SellerScreenLayout>
    );
  }

  return (
    <SellerScreenLayout title="Quản Lý Đơn Hàng" subtitle="Danh sách đơn hàng">
      <ScrollView 
        style={styles.scrollViewContainer}
        nestedScrollEnabled={true}
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
            filteredOrders.map((item, index) => renderOrderItem(item, index))
          )}
        </View>
      </ScrollView>
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
    fontSize: hp('1.8%'),
  },
  listContainer: {
    padding: wp('4%'),
  },
  orderRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: hp('2%'),
    marginBottom: hp('2%'),
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
});