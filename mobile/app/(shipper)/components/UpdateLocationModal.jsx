import { useState } from 'react';
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../constants/api';
import { shipperStyles } from '../styles/shipperStyles';

const API_BASE_URL = API_URL;

export default function UpdateLocationModal({ visible, orderStatusId, shipperId, onClose }) {
  const [location, setLocation] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!location.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ!');
      return;
    }

    if (!orderStatusId) {
      Alert.alert('Lỗi', 'Không tìm thấy ID trạng thái đơn hàng!');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`${API_BASE_URL}/order_status/${orderStatusId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          current_location: location, 
          shipper_id: shipperId 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cập nhật thất bại: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      Alert.alert('Thành công', 'Địa chỉ đã được cập nhật!');
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
            <Text style={shipperStyles.modalTitle}>Cập nhật vị trí</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={shipperStyles.locationInput}
            placeholder="Nhập địa chỉ hiện tại (ví dụ: 123 Đường ABC, Quận 1, TP.HCM)"
            value={location}
            onChangeText={setLocation}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={updating || !location.trim()}
            style={[
              shipperStyles.updateModalButton,
              (!location.trim() || updating) && shipperStyles.updateModalButtonDisabled,
            ]}
          >
            <Text style={shipperStyles.updateModalButtonText}>
              {updating ? 'Đang cập nhật...' : 'Cập nhật'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}