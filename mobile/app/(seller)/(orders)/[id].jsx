// File: app/(seller)/order/[id].jsx (OrderDetail - Chi Tiết Đơn Hàng)
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { API_URL } from '../../../constants/api';
import SellerScreenLayout from '../components/SellerScreenLayout';

const API_BASE = API_URL;

// Mapping trạng thái sang text tiếng Việt và màu sắc
const STATUS_MAP = {
  pending: { text: 'Chờ Xử Lý', color: '#FFA500', bgColor: '#FFE5CC' },
  processing: { text: 'Đang Xử Lý', color: '#FFD700', bgColor: '#FFF3CD' },
  shipped: { text: 'Đang Giao', color: '#87CEEB', bgColor: '#E3F2FD' },
  delivered: { text: 'Đã Giao', color: '#32CD32', bgColor: '#D4EDDA' },
  cancelled: { text: 'Đã Hủy', color: '#FF4500', bgColor: '#F8D7DA' },
};

// Hàm fetch thông tin user (buyer/seller/shipper)
const fetchUserInfo = async (userId) => {
  if (!userId) return null;
  try {
    const response = await fetch(`${API_BASE}/customers/${userId}`);
    if (!response.ok) {
      console.warn(`Failed to fetch user ${userId}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    return {
      first_name: data.first_name || data.firstname || undefined,
      last_name: data.last_name || data.lastname || undefined,
      phone: data.phone_number || data.phone || undefined,
      // Thêm avatar nếu cần: avatar: data.avatar || data.avatar_url || undefined,
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};

// Hàm fetch thông tin product (name, price, và variants để lấy color/size nếu có)
const fetchProductInfo = async (productId) => {
  if (!productId) return null;
  try {
    const response = await fetch(`${API_BASE}/product/${productId}`);
    if (!response.ok) {
      console.warn(`Failed to fetch product ${productId}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    // console.log("data product: ", data); // Giữ để debug nếu cần

    // Xử lý variants để lấy price fallback nếu root price null, và color/size mặc định
    let productPrice = data.price;
    let defaultColor = null;
    let defaultSize = null;
    if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
      const firstVariant = data.variants[0];
      if (data.price === null && firstVariant && firstVariant.price) {
        productPrice = firstVariant.price; // Fallback: lấy price variant đầu tiên
      }
      defaultColor = firstVariant.color;
      defaultSize = firstVariant.size;
    }

    const productInfo = {
      name: data.name || data.product_name || undefined,
      price: productPrice, // Thêm price
      // image: data.images?.[0] || data.image || data.image_url || undefined, // Nếu cần hiển thị image
      variants: data.variants || undefined, // Để dùng nếu cần chi tiết hơn
      defaultColor: defaultColor,
      defaultSize: defaultSize,
    };
    return productInfo;
  } catch (error) {
    console.error('Error fetching product info:', error);
    return null;
  }
};

export default function OrderDetail() {
  const router = useRouter();
  const { user } = useUser();
  const sellerId = user?.id;
  const { id } = useLocalSearchParams(); // Lấy order ID từ route params

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (id && sellerId) {
      loadOrderDetail();
    }
  }, [id, sellerId]);

  const loadOrderDetail = async () => {
    if (!id || !sellerId) {
      Alert.alert('Lỗi', 'Không thể lấy thông tin');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/order_status/${id}`);
      if (!response.ok) throw new Error('Lỗi tải chi tiết');
      let data = await response.json();

      // Enrich data: Fetch buyer, seller, shipper, product info
      const [buyerInfo, sellerInfo, shipperInfo, productInfo] = await Promise.all([
        fetchUserInfo(data.buyer_id),
        fetchUserInfo(data.seller_id),
        data.shipper_id ? fetchUserInfo(data.shipper_id) : null,
        fetchProductInfo(data.product_id),
      ]);

      // Gộp enriched info vào order
      data = {
        ...data,
        buyerInfo,
        sellerInfo,
        shipperInfo,
        productInfo,
      };

      setOrder(data);
      setNewStatus(data.status);
    } catch (error) {
      console.error('Lỗi load order detail:', error);
      Alert.alert('Lỗi', 'Không thể tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    if (!id || !sellerId) {
      Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/order_status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, seller_id: sellerId }),
      });
      if (!response.ok) throw new Error('Lỗi cập nhật');
      Alert.alert('Thành công', 'Cập nhật trạng thái đơn hàng thành công');
      setModalVisible(false);
      loadOrderDetail(); // Reload chi tiết (sẽ re-enrich)
    } catch (error) {
      console.error('Lỗi update status:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái');
    }
  };

  const openUpdateModal = () => {
    setModalVisible(true);
  };

  // Helper để hiển thị tên user
  const getUserDisplayName = (userInfo, fallbackId) => {
    if (userInfo && userInfo.first_name && userInfo.last_name) {
      return `${userInfo.first_name} ${userInfo.last_name}`.trim();
    }
    return fallbackId || 'N/A';
  };

  // Helper để hiển thị shipper (với fallback nếu chưa assign)
  const getShipperDisplay = () => {
    if (order.shipper_id && order.shipperInfo) {
      return getUserDisplayName(order.shipperInfo, order.shipper_id);
    }
    return 'Chưa assign người giao hàng';
  };

  if (loading || !order) {
    return (
      <SellerScreenLayout title="Chi Tiết Đơn Hàng" subtitle="Thông tin chi tiết">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EE4D2D" />
          <Text style={styles.loadingText}>Đang tải chi tiết...</Text>
        </View>
      </SellerScreenLayout>
    );
  }

  return (
    <SellerScreenLayout title="Chi Tiết Đơn Hàng" subtitle="Thông tin chi tiết">
      <ScrollView style={styles.scrollViewContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mã Đơn Hàng:</Text>
            <Text style={styles.detailValue}>#{order.order_id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Sản Phẩm:</Text>
            <Text style={styles.detailValue}>{order.productInfo?.name || order.product_id || 'N/A'}</Text>
          </View>
          {order.productInfo?.price && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Giá Sản Phẩm:</Text>
              <Text style={styles.detailValue}>{order.productInfo.price.toLocaleString()} VND</Text>
            </View>
          )}
          {order.quantity && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Số Lượng:</Text>
              <Text style={styles.detailValue}>{order.quantity}</Text>
            </View>
          )}
          {(order.color || order.productInfo?.defaultColor) && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Màu Sắc:</Text>
              <Text style={styles.detailValue}>{order.color || order.productInfo?.defaultColor || 'N/A'}</Text>
            </View>
          )}
          {(order.size || order.productInfo?.defaultSize) && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kích Cỡ:</Text>
              <Text style={styles.detailValue}>{order.size || order.productInfo?.defaultSize || 'N/A'}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Khách Hàng:</Text>
            <Text style={styles.detailValue}>{getUserDisplayName(order.buyerInfo, order.buyer_id)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Người bán:</Text>
            <Text style={styles.detailValue}>{getUserDisplayName(order.sellerInfo, order.seller_id)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Người Giao Hàng:</Text>
            <Text style={styles.detailValue}>{getShipperDisplay()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Trạng Thái:</Text>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_MAP[order.status]?.bgColor }]}>
              <Text style={[styles.statusText, { color: STATUS_MAP[order.status]?.color }]}>
                {STATUS_MAP[order.status]?.text}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ngày Tạo:</Text>
            <Text style={styles.detailValue}>{new Date(order.created_at).toLocaleDateString('vi-VN')}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ngày Cập Nhật:</Text>
            <Text style={styles.detailValue}>{new Date(order.updated_at).toLocaleDateString('vi-VN')}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={openUpdateModal}
          activeOpacity={0.7}
        >
          <Text style={styles.updateButtonText}>Cập Nhật Trạng Thái</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Cập Nhật Trạng Thái */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cập Nhật Trạng Thái</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={hp('2.5%')} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalOrderId}>Đơn hàng: #{order.order_id}</Text>
            <Text style={styles.modalLabel}>Chọn trạng thái mới:</Text>
            <TouchableOpacity
              style={styles.statusOption}
              onPress={() => setNewStatus('pending')}
              activeOpacity={0.8}
            >
              <View style={[styles.statusCircle, newStatus === 'pending' && styles.statusCircleSelected]} />
              <Text style={styles.statusOptionText}>Chờ Xử Lý</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statusOption}
              onPress={() => setNewStatus('processing')}
              activeOpacity={0.8}
            >
              <View style={[styles.statusCircle, newStatus === 'processing' && styles.statusCircleSelected]} />
              <Text style={styles.statusOptionText}>Đang Xử Lý</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statusOption}
              onPress={() => setNewStatus('shipped')}
              activeOpacity={0.8}
            >
              <View style={[styles.statusCircle, newStatus === 'shipped' && styles.statusCircleSelected]} />
              <Text style={styles.statusOptionText}>Đang Giao</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statusOption}
              onPress={() => setNewStatus('delivered')}
              activeOpacity={0.8}
            >
              <View style={[styles.statusCircle, newStatus === 'delivered' && styles.statusCircleSelected]} />
              <Text style={styles.statusOptionText}>Đã Giao</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statusOption}
              onPress={() => setNewStatus('cancelled')}
              activeOpacity={0.8}
            >
              <View style={[styles.statusCircle, newStatus === 'cancelled' && styles.statusCircleSelected]} />
              <Text style={styles.statusOptionText}>Đã Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => updateStatus(newStatus)}
              activeOpacity={0.7}
            >
              <Text style={styles.saveBtnText}>Lưu Thay Đổi</Text>
            </TouchableOpacity>
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
  detailContainer: {
    padding: wp('4%'),
    backgroundColor: '#FFF',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  detailLabel: {
    fontSize: hp('1.8%'),
    color: '#666',
    fontWeight: '600',
    flex: 1,
  },
  detailValue: {
    fontSize: hp('1.8%'),
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 20,
  },
  statusText: {
    fontSize: hp('1.5%'),
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: '#EE4D2D',
    paddingVertical: hp('2%'),
    margin: wp('4%'),
    borderRadius: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: hp('2%'),
    fontWeight: '700',
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