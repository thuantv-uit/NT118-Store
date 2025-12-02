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

// CẬP NHẬT: Hàm fetch thông tin variant (thay vì product, dùng variant_id để lấy chi tiết đầy đủ) - THÊM LOG ĐỂ DEBUG
const fetchVariantInfo = async (variantId) => {
  if (!variantId) {
    // console.log('Debug fetchVariantInfo: variantId is null or undefined, skipping fetch');
    return null;
  }
  try {
    // console.log(`Debug fetchVariantInfo: Calling API for variantId = ${variantId}`);
    const response = await fetch(`${API_BASE}/product/product_variant/${variantId}`);
    // console.log(`Debug fetchVariantInfo: API response status = ${response.status}`);
    if (!response.ok) {
      console.warn(`Failed to fetch variant ${variantId}: ${response.status}`);
      return null;
    }
    const resData = await response.json();
    // console.log('Debug fetchVariantInfo: Full API response data =', resData);  // LOG ĐẦY ĐỦ ĐỂ DEBUG LỖI DỮ LIỆU

    const data = resData.data || resData; // Giả sử response có { success: true, data: {...} }
    // console.log('Debug fetchVariantInfo: Processed data after extracting =', data);  // LOG SAU KHI XỬ LÝ

    const variantInfo = {
      name: data.product_name || 'N/A', // Tên sản phẩm từ variant
      price: parseFloat(data.price) || 0, // Parse string price thành number
      size: data.size || 'N/A',
      color: data.color || 'N/A',
      stock: data.stock || 0, // Thêm stock nếu cần hiển thị sau
    };
    // console.log('Debug fetchVariantInfo: Final variantInfo object =', variantInfo);  // LOG CUỐI CÙNG ĐỂ KIỂM TRA
    return variantInfo;
  } catch (error) {
    console.error('Error fetching variant info:', error);
    return null;
  }
};

export default function OrderDetail() {
  const router = useRouter();
  const { user } = useUser();
  const sellerId = user?.id;
  const { id } = useLocalSearchParams(); // Lấy order_status ID từ route params

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
      // console.log(`Debug loadOrderDetail: Fetching order_status/${id}`);  // THÊM LOG CHO LOAD CHÍNH
      const response = await fetch(`${API_BASE}/order_status/${id}`);
      // console.log(`Debug loadOrderDetail: order_status API response status = ${response.status}`);
      if (!response.ok) throw new Error('Lỗi tải chi tiết');
      let data = await response.json();
      // console.log('Debug loadOrderDetail: Full order_status data =', data);  // LOG ĐẦY ĐỦ ORDER_STATUS ĐỂ KIỂM TRA VARIANT_ID

      // CẬP NHẬT: In ra giá trị variant_id ngay sau khi fetch (để debug khi click)
      // console.log('Data:', data);
      // console.log('Variant ID:', data.variant_id);  // <-- THÊM LOG NÀY ĐÂY!

      // CẬP NHẬT: Lấy quantity trực tiếp từ order_status response
      const quantity = data.quantity || null;
      // console.log('Debug loadOrderDetail: Extracted quantity =', quantity);

      // CẬP NHẬT: Check variant_id - Nếu không có, throw error ngay
      if (!data.variant_id) {
        throw new Error('Thiếu variant_id trong đơn hàng. Không thể tải chi tiết sản phẩm.');
      }
      // console.log('Debug loadOrderDetail: Found variant_id =', data.variant_id);

      // Enrich data: Fetch buyer, seller, shipper, và variant info (bắt buộc fetch vì đã check variant_id)
      const [buyerInfo, sellerInfo, shipperInfo, variantInfo] = await Promise.all([
        fetchUserInfo(data.buyer_id),
        fetchUserInfo(data.seller_id),
        data.shipper_id ? fetchUserInfo(data.shipper_id) : null,
        fetchVariantInfo(data.variant_id), // Luôn fetch vì đã check tồn tại
      ]);

      // CẬP NHẬT: Nếu variantInfo null (API fail), throw error
      if (!variantInfo) {
        throw new Error('Không thể lấy thông tin sản phẩm từ variant_id.');
      }

      // console.log('Debug loadOrderDetail: Enriched buyerInfo =', buyerInfo);
      // console.log('Debug loadOrderDetail: Enriched sellerInfo =', sellerInfo);
      // console.log('Debug loadOrderDetail: Enriched shipperInfo =', shipperInfo);
      // console.log('Debug loadOrderDetail: Enriched variantInfo =', variantInfo);

      // Gộp enriched info vào order
      data = {
        ...data,
        quantity,
        buyerInfo,
        sellerInfo,
        shipperInfo,
        productInfo: variantInfo, // Không fallback nữa, vì đã check
      };
      // console.log('Debug loadOrderDetail: Final merged order data =', data);  // LOG CUỐI CÙNG ĐỂ KIỂM TRA TOÀN BỘ

      setOrder(data);
      setNewStatus(data.status);
    } catch (error) {
      console.error('Lỗi load order detail:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // CẬP NHẬT: Hàm update stock variant (gọi khi chuyển từ pending sang processing)
  const updateVariantStock = async (productId, variantId, change) => {
    if (!productId || !variantId || change === undefined) {
      console.warn('Missing params for stock update');
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/product/products/${productId}/variants/${variantId}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update stock:', errorText);
        Alert.alert('Lỗi', 'Không thể cập nhật tồn kho. Vui lòng thử lại.');
        return false;
      }

      const result = await response.json();
      // console.log('Stock updated successfully:', result);
      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật tồn kho.');
      return false;
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

      // CẬP NHẬT: Nếu chuyển từ 'pending' sang 'processing', giảm stock variant bằng quantity
      if (order.status === 'pending' && status === 'processing' && order.quantity > 0 && order.product_id && order.variant_id) {
        const stockUpdated = await updateVariantStock(order.product_id, order.variant_id, -order.quantity);
        if (!stockUpdated) {
          // Nếu update stock fail, có thể rollback status hoặc chỉ warn (tùy business logic)
          Alert.alert('Cảnh báo', 'Cập nhật trạng thái thành công, nhưng tồn kho chưa được điều chỉnh. Vui lòng kiểm tra thủ công.');
        } else {
          Alert.alert('Thành công', 'Cập nhật trạng thái và tồn kho thành công!');
        }
      } else {
        Alert.alert('Thành công', 'Cập nhật trạng thái đơn hàng thành công');
      }

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

  // CẬP NHẬT: Helper hiển thị ngày với múi giờ Việt Nam
  const formatDateVN = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', { 
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
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
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.detailContainer}>
          {/* CẬP NHẬT: Hiển thị số lượng sản phẩm trực tiếp từ order_status */}
          {order.quantity && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Số Lượng:</Text>
              <Text style={styles.detailValue}>{order.quantity}</Text>
            </View>
          )}

          {/* CẬP NHẬT: UI Sản phẩm gọn gàng hơn - gộp tên, size, color vào một row, giá riêng */}
          <View style={styles.productSection}>
            <Text style={styles.sectionTitle}>Sản Phẩm</Text>
            <View style={styles.productCard}>
              <Text style={styles.productName}>{order.productInfo?.name || 'N/A'}</Text>
              <Text style={styles.productVariant}>
                {order.productInfo?.size !== 'N/A' && `Size: ${order.productInfo.size} | `}
                {order.productInfo?.color !== 'N/A' && `Màu: ${order.productInfo.color}`}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.detailLabel}>Giá:</Text>
              <Text style={styles.priceValue}>
                {order.productInfo?.price > 0 
                  ? `${order.productInfo.price.toLocaleString('vi-VN')} VNĐ` 
                  : 'N/A'
                }
              </Text>
            </View>
          </View>

          {/* Người dùng */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Khách Hàng:</Text>
            <Text style={styles.detailValue}>{getUserDisplayName(order.buyerInfo, order.buyer_id)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Seller:</Text>
            <Text style={styles.detailValue}>{getUserDisplayName(order.sellerInfo, order.seller_id)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Người Giao Hàng:</Text>
            <Text style={styles.detailValue}>{getShipperDisplay()}</Text>
          </View>

          {/* Trạng thái */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Trạng Thái:</Text>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_MAP[order.status]?.bgColor }]}>
              <Text style={[styles.statusText, { color: STATUS_MAP[order.status]?.color }]}>
                {STATUS_MAP[order.status]?.text}
              </Text>
            </View>
          </View>
          {/* CẬP NHẬT: Ngày với múi giờ VN */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ngày Tạo:</Text>
            <Text style={styles.detailValue}>{formatDateVN(order.created_at)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ngày Cập Nhật:</Text>
            <Text style={styles.detailValue}>{formatDateVN(order.updated_at)}</Text>
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
  // CẬP NHẬT: Styles mới cho phần sản phẩm gọn gàng
  productSection: {
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: hp('2.2%'),
    fontWeight: '700',
    color: '#333',
    marginBottom: hp('1%'),
  },
  productCard: {
    backgroundColor: '#F8F9FA',
    padding: wp('4%'),
    borderRadius: 8,
    marginBottom: hp('1%'),
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  productName: {
    fontSize: hp('2%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('0.5%'),
  },
  productVariant: {
    fontSize: hp('1.6%'),
    color: '#666',
    marginBottom: hp('0.5%'),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  priceValue: {
    fontSize: hp('2%'),
    fontWeight: '600',
    color: '#EE4D2D',
    textAlign: 'right',
    flex: 1,
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