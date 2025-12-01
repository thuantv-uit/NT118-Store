import { useState } from 'react';
import {
    Alert,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../constants/api';
import { shipperStyles } from '../styles/shipperStyles';

const API_BASE_URL = API_URL;

const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];

export default function UpdateStatusModal({ visible, order, shipperId, onClose }) {
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const statusOptions = validStatuses.map(status => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
    icon: status === 'processing' ? 'construct-outline' : status === 'shipped' ? 'airplane-outline' : status === 'delivered' ? 'checkmark-circle-outline' : 'close-circle-outline'
  }));

  const handleUpdate = async (status) => {
    if (!status) {
      Alert.alert('Lỗi', 'Vui lòng chọn trạng thái!');
      return;
    }

    if (!order.id) {
      Alert.alert('Lỗi', 'Không tìm thấy ID trạng thái đơn hàng!');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`${API_BASE_URL}/order_status/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: status, 
          shipper_id: shipperId 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cập nhật thất bại: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      Alert.alert('Thành công', `Trạng thái đã được cập nhật thành ${statusOptions.find(s => s.value === status).label}!`);
      onClose();
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật!');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={shipperStyles.modalOverlay}>
        <View style={shipperStyles.modalContent}>
          <View style={shipperStyles.modalHeader}>
            <Text style={shipperStyles.modalTitle}>Cập nhật trạng thái đơn hàng</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={shipperStyles.modalDescription}>Chọn trạng thái mới cho đơn hàng:</Text>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleUpdate(option.value)}
              disabled={updating}
              style={[
                shipperStyles.statusOption,
                selectedStatus === option.value && shipperStyles.statusOptionSelected,
                updating && shipperStyles.statusOptionDisabled
              ]}
            >
              <Icon name={option.icon} size={20} color="#FFF" />
              <Text style={shipperStyles.statusOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}