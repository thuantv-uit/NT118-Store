import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { shipperStyles } from '../_styles/shipperStyles';

const statusSteps = {
  pending: { label: 'Chờ xác nhận', icon: 'time-outline', color: '#FF8FB1' },
  processing: { label: 'Đang xử lý', icon: 'construct-outline', color: '#FFD6E8' },
  shipped: { label: 'Đang giao', icon: 'airplane-outline', color: '#FF4D79' },
  delivered: { label: 'Đã nhận', icon: 'checkmark-circle-outline', color: '#FF4D79' },
  cancelled: { label: 'Đã hủy', icon: 'close-circle-outline', color: '#FF8FB1' },
};

export default function OrderItem({ order, onPressDetail, onUpdateLocation, onUpdateStatus, buyerInfo, shipmentInfo }) {
  if (!order) {
    console.warn('OrderItem: Received null order, skipping render');
    return null;
  }

  const step = statusSteps[order.status] || { label: order.status, icon: 'help-outline', color: '#999' };

  const handlePressDetail = () => {
    onPressDetail(order);
  };

  const handlePressUpdateLocation = () => {
    onUpdateLocation(order);
  };

  const handlePressUpdateStatus = () => {
    onUpdateStatus(order);
  };

  const displayName = buyerInfo ? `${buyerInfo.firstname || ''} ${buyerInfo.lastname || ''}`.trim() || `Buyer: ${order.buyer_id?.slice(0, 8)}...` : `Buyer: ${order.buyer_id?.slice(0, 8)}...`;

  // CẬP NHẬT: Hiển thị vị trí giao hàng ngắn gọn từ shipmentInfo (nếu có)
  const deliveryAddressShort = shipmentInfo ? [
    shipmentInfo.city || '',
    shipmentInfo.address ? shipmentInfo.address.slice(0, 20) + '...' : ''
  ].filter(Boolean).join(', ') : 'Chưa có địa chỉ giao';

  return (
    <TouchableOpacity onPress={handlePressDetail} activeOpacity={0.7} style={shipperStyles.orderItem}>
      <View style={shipperStyles.orderAvatarContainer}>
        {buyerInfo?.avatar ? (
          <Image source={{ uri: buyerInfo.avatar }} style={shipperStyles.buyerAvatar} />
        ) : (
          <View style={[shipperStyles.buyerAvatar, { backgroundColor: '#E0E0E0' }]}>
            <Icon name="person-outline" size={24} color="#999" />
          </View>
        )}
      </View>
      <View style={shipperStyles.orderInfo}>
        <View style={shipperStyles.orderHeader}>
          <View style={[shipperStyles.statusIcon, { backgroundColor: step.color }]}>
            <Icon name={step.icon} size={20} color="#FFF" />
          </View>
          <Text style={[shipperStyles.orderStatus, { color: step.color }]}>{step.label}</Text>
        </View>
        <Text style={shipperStyles.orderBuyer}>{displayName}</Text>
        {buyerInfo?.phone && <Text style={shipperStyles.orderPhone}>SĐT: {buyerInfo.phone}</Text>}
        {/* CẬP NHẬT: Thêm hiển thị vị trí giao hàng (ngắn gọn) */}
        {deliveryAddressShort !== 'Chưa có địa chỉ giao' && (
          <Text style={shipperStyles.orderLocation} numberOfLines={1}>Giao đến: {deliveryAddressShort}</Text>
        )}
        {order?.current_location && (
          <Text style={shipperStyles.orderLocation}>Vị trí hiện: {order.current_location}</Text>
        )}
      </View>
      <View style={shipperStyles.orderActions}>
        <TouchableOpacity onPress={handlePressUpdateLocation} style={[shipperStyles.actionButton, shipperStyles.locationButton]}>
          <Icon name="location" size={16} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePressUpdateStatus} style={[shipperStyles.actionButton, shipperStyles.statusButton]}>
          <Icon name="refresh" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
