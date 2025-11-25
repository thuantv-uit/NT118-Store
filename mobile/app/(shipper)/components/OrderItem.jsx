import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { shipperStyles } from '../styles/shipperStyles';

const statusSteps = {
  pending: { label: 'Chờ xác nhận', icon: 'time-outline', color: '#FF6B00' },
  processing: { label: 'Đang xử lý', icon: 'construct-outline', color: '#FFA500' },
  shipped: { label: 'Đang giao', icon: 'airplane-outline', color: '#00A651' },
  delivered: { label: 'Đã nhận', icon: 'checkmark-circle-outline', color: '#00A651' },
  cancelled: { label: 'Đã hủy', icon: 'close-circle-outline', color: '#FF4D4F' },
};

export default function OrderItem({ order, onUpdateLocation }) {
  const step = statusSteps[order.status] || { label: order.status, icon: 'help-outline', color: '#999' };

  const handlePressUpdate = () => {
    onUpdateLocation(order);
  };

  return (
    <View style={shipperStyles.orderItem}>
      <View style={[shipperStyles.statusIcon, { backgroundColor: step.color }]}>
        <Icon name={step.icon} size={20} color="#FFF" />
      </View>
      <View style={shipperStyles.orderInfo}>
        <Text style={[shipperStyles.orderStatus, { color: step.color }]}>{step.label}</Text>
        <Text style={shipperStyles.orderBuyer}>Buyer: {order.buyer_id.slice(0, 8)}...</Text>
        {order.current_location && (
          <Text style={shipperStyles.orderLocation}>Vị trí: {order.current_location}</Text>
        )}
      </View>
      <TouchableOpacity onPress={handlePressUpdate} style={shipperStyles.updateButton}>
        <Icon name="location" size={16} color="#FFF" />
        <Text style={shipperStyles.updateButtonText}>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  );
}