import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { shipperStyles } from '../styles/shipperStyles';

const statusLabels = {
  pending: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã nhận',
  cancelled: 'Đã hủy',
};

export default function OrderDetailModal({ visible, order, buyerInfo, productInfo, orderInfo, shipmentInfo, quantity, onClose }) {
  const [loading, setLoading] = useState(false);

  const fetchOrderDetails = async () => {
    setLoading(false);
  };

  useEffect(() => {
    if (visible) fetchOrderDetails();
  }, [visible]);

  if (!order || !visible) {
    return null;
  }

  const displayName = buyerInfo ? `${buyerInfo.firstname || ''} ${buyerInfo.lastname || ''}`.trim() || 'N/A' : 'N/A';

  // Hiển thị địa chỉ giao hàng từ shipmentInfo
  const deliveryAddress = shipmentInfo ? [
    shipmentInfo.address || 'N/A',
    shipmentInfo.city ? `${shipmentInfo.city},` : '',
    shipmentInfo.state ? `${shipmentInfo.state},` : '',
    shipmentInfo.country || 'N/A'
  ].filter(Boolean).join(' ') : 'Chưa có thông tin địa chỉ giao hàng';

  // current_location là vị trí hiện tại (của shipper)
  const currentLocation = order?.current_location || 'Chưa cập nhật vị trí hiện tại';

  const statusLabel = statusLabels[order.status] || order.status;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={shipperStyles.modalOverlay}>
        <View style={[shipperStyles.modalContent, { height: '80%' }]}>
          <View style={shipperStyles.modalHeader}>
            <Text style={shipperStyles.modalTitle}>Chi tiết đơn hàng</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={shipperStyles.detailScroll}>
            <View style={shipperStyles.detailSection}>
              <Text style={shipperStyles.sectionTitle}>Thông tin khách hàng</Text>
              <View style={shipperStyles.detailRow}>
                <View style={shipperStyles.avatarContainer}>
                  {buyerInfo?.avatar ? (
                    <Image source={{ uri: buyerInfo.avatar }} style={shipperStyles.detailAvatar} />
                  ) : (
                    <View style={[shipperStyles.detailAvatar, { backgroundColor: '#E0E0E0' }]}>
                      <Icon name="person-outline" size={32} color="#999" />
                    </View>
                  )}
                </View>
                <View style={shipperStyles.detailInfo}>
                  <Text style={shipperStyles.detailName}>{displayName}</Text>
                  {buyerInfo?.phone && <Text style={shipperStyles.detailPhone}>SĐT: {buyerInfo.phone}</Text>}
                </View>
              </View>
            </View>
            <View style={shipperStyles.detailSection}>
              <Text style={shipperStyles.sectionTitle}>Địa chỉ giao hàng</Text>
              <Text style={shipperStyles.detailAddress}>{deliveryAddress}</Text>
            </View>
            <View style={shipperStyles.detailSection}>
              <Text style={shipperStyles.sectionTitle}>Vị trí hiện tại (Shipper)</Text>
              <Text style={shipperStyles.detailAddress}>{currentLocation}</Text>
            </View>
            <View style={shipperStyles.detailSection}>
              <Text style={shipperStyles.sectionTitle}>Thông tin sản phẩm</Text>
              {productInfo ? (
                <View style={shipperStyles.detailRow}>
                  {productInfo.image && (
                    <Image source={{ uri: productInfo.image }} style={shipperStyles.productImage} />
                  )}
                  <View style={shipperStyles.detailInfo}>
                    <Text style={shipperStyles.detailName}>{productInfo.name || 'N/A'}</Text>
                    {/* CẬP NHẬT: Hiển thị quantity nếu có */}
                    {quantity && <Text style={shipperStyles.detailItem}>Số lượng: {quantity}</Text>}
                    <Text style={shipperStyles.detailItem}>Giá: {productInfo.price ? `${productInfo.price.toLocaleString()} VND` : 'N/A'}</Text>
                    {/* CẬP NHẬT: Nếu có variantInfo, hiển thị size/color */}
                    {order.variantInfo && (
                      <>
                        {order.variantInfo.size !== 'N/A' && <Text style={shipperStyles.detailItem}>Size: {order.variantInfo.size}</Text>}
                        {order.variantInfo.color !== 'N/A' && <Text style={shipperStyles.detailItem}>Màu: {order.variantInfo.color}</Text>}
                      </>
                    )}
                  </View>
                </View>
              ) : (
                <Text style={shipperStyles.detailItem}>Sản phẩm ID: {order.product_id}</Text>
              )}
            </View>
            <View style={shipperStyles.detailSection}>
              <Text style={shipperStyles.sectionTitle}>Thông tin đơn hàng</Text>
              <Text style={shipperStyles.detailItem}>Trạng thái: {statusLabel}</Text>
              <Text style={shipperStyles.detailItem}>Tạo đơn hàng: {new Date(order.created_at).toLocaleString('vi-VN')}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}