import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from 'react-native-vector-icons';
import { API_URL } from '../../../constants/api';
import { styles as profileStyles } from '../_styles/ProfileStyles'; // Adjust path as needed

const API_BASE_URL = API_URL;

export default function DeliveryScreen() {
  const { user } = useUser();
  const customerId = user?.id;
  const navigation = useNavigation();

  // States
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form state for create
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: 'Việt Nam',
    zipcode: '',
    is_default: false,
  });

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/shipping_addresses/${customerId}`);
      setAddresses(response.data || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError(err.response?.data?.message || 'Lỗi tải địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [customerId]);

  // Handle form change
  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Create address
  const handleCreateAddress = async () => {
    if (!customerId || !formData.address || !formData.city || !formData.state || !formData.country || !formData.zipcode) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      const payload = { ...formData, customer_id: customerId };
      const response = await axios.post(`${API_BASE_URL}/shipping_addresses`, payload);
      Alert.alert('Thành công', 'Đã thêm địa chỉ mới!');
      setFormData({ name: '', address: '', city: '', state: '', country: 'Việt Nam', zipcode: '', is_default: false }); // Reset form
      fetchAddresses(); // Refresh list
    } catch (err) {
      console.error('Error creating address:', err);
      Alert.alert('Lỗi', err.response?.data?.message || 'Lỗi tạo địa chỉ');
    } finally {
      setCreating(false);
    }
  };

  // Delete address
  const handleDeleteAddress = (id) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa địa chỉ này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingId(id);
              setError(null);
              await axios.delete(`${API_BASE_URL}/shipping_addresses/${id}`);
              Alert.alert('Thành công', 'Đã xóa địa chỉ!');
              fetchAddresses(); // Refresh list
            } catch (err) {
              console.error('Error deleting address:', err);
              Alert.alert('Lỗi', err.response?.data?.message || 'Lỗi xóa địa chỉ');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Render address item
  const renderAddressItem = ({ item }) => (
    <View style={[profileStyles.infoCard, styles.addressItem]}>
      <View style={[profileStyles.infoRow, { justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }]}>
        <Text style={[profileStyles.infoValue, { fontWeight: '700' }]}>{item.name || 'Địa chỉ mặc định'}</Text>
        {item.is_default && (
          <View style={[profileStyles.infoBadge, { backgroundColor: profileStyles.PRIMARY_LIGHT || '#FFE6F0', color: profileStyles.PRIMARY_DARK || '#C2185B' }]}>
            <Text style={{ color: profileStyles.PRIMARY_DARK || '#C2185B', fontWeight: '700', fontSize: 12 }}>Mặc định</Text>
          </View>
        )}
      </View>
      <Text style={[profileStyles.infoValue, { fontSize: 14 }]}>{item.address}</Text>
      <Text style={[profileStyles.infoLabel, { fontSize: 13 }]}>{item.city}, {item.state}, {item.country} - {item.zipcode}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteAddress(item.id)}
        style={[
          profileStyles.secondaryButton, 
          { 
            backgroundColor: profileStyles.PRIMARY_LIGHT || '#FFE6F0',
            borderColor: profileStyles.PRIMARY || '#FF4D79',
            marginTop: 10,
            alignSelf: 'flex-start',
            paddingHorizontal: 12,
            paddingVertical: 6
          }
        ]}
        disabled={deletingId === item.id}
      >
        <Text style={{ color: profileStyles.PRIMARY || '#FF4D79', fontWeight: '600' }}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && addresses.length === 0) {
    return (
      <SafeAreaView style={[profileStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={profileStyles.PRIMARY || '#FF4D79'} />
        <Text style={{ color: profileStyles.TEXT || '#2A0E23', marginTop: 8 }}>Đang tải địa chỉ...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={profileStyles.container}>
      <View style={{ flex: 1 }}>
        {/* Header - Adapted from profileStyles.header */}
        <View style={[profileStyles.header, { paddingVertical: 16 }]}>
          <TouchableOpacity onPress={handleBack} style={[profileStyles.backButtonContainer, { marginRight: 10 }]}>
            <Ionicons name="arrow-back" size={24} color={profileStyles.PRIMARY || '#FF4D79'} />
          </TouchableOpacity>
          <Text style={[profileStyles.updateTitle, { flex: 1 }]}>Thông tin giao hàng</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {error && (
            <View style={[profileStyles.section, { backgroundColor: profileStyles.PRIMARY_LIGHT || '#FFE6F0', marginTop: profileStyles.screenPadding || 16 }]}>
              <Text style={{ color: profileStyles.PRIMARY_DARK || '#C2185B' }}>{error}</Text>
              <TouchableOpacity onPress={fetchAddresses} style={{ marginTop: 5 }}>
                <Text style={{ color: profileStyles.PRIMARY || '#FF4D79' }}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Danh sách địa chỉ - Using section */}
          <View style={[profileStyles.section, { marginTop: profileStyles.screenPadding || 16 }]}>
            <Text style={profileStyles.sectionTitle}>Danh sách địa chỉ</Text>
            {addresses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={{ color: profileStyles.TEXT_MUTED || '#7A5368', textAlign: 'center', marginTop: 20 }}>
                  Chưa có địa chỉ nào. Thêm địa chỉ mới bên dưới!
                </Text>
              </View>
            ) : (
              <FlatList
                data={addresses}
                renderItem={renderAddressItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                style={{ marginTop: 12 }}
              />
            )}
          </View>

          {/* Form thêm địa chỉ mới - Using section */}
          <View style={[profileStyles.section, { borderTopWidth: 1, borderTopColor: profileStyles.BORDER || '#FFD6E8' }]}>
            <Text style={profileStyles.sectionTitle}>Thêm địa chỉ mới</Text>
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Tên địa chỉ (tùy chọn)</Text>
              <TextInput
                style={profileStyles.input}
                placeholder="Tên địa chỉ (tùy chọn)"
                value={formData.name}
                onChangeText={(value) => handleFormChange('name', value)}
                placeholderTextColor={profileStyles.TEXT_MUTED || '#7A5368'}
              />
            </View>
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Địa chỉ *</Text>
              <TextInput
                style={profileStyles.input}
                placeholder="Địa chỉ *"
                value={formData.address}
                onChangeText={(value) => handleFormChange('address', value)}
                placeholderTextColor={profileStyles.TEXT_MUTED || '#7A5368'}
              />
            </View>
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Thành phố *</Text>
              <TextInput
                style={profileStyles.input}
                placeholder="Thành phố *"
                value={formData.city}
                onChangeText={(value) => handleFormChange('city', value)}
                placeholderTextColor={profileStyles.TEXT_MUTED || '#7A5368'}
              />
            </View>
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Tỉnh/Thành *</Text>
              <TextInput
                style={profileStyles.input}
                placeholder="Tỉnh/Thành *"
                value={formData.state}
                onChangeText={(value) => handleFormChange('state', value)}
                placeholderTextColor={profileStyles.TEXT_MUTED || '#7A5368'}
              />
            </View>
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Quốc gia *</Text>
              <TextInput
                style={profileStyles.input}
                placeholder="Quốc gia *"
                value={formData.country}
                onChangeText={(value) => handleFormChange('country', value)}
                placeholderTextColor={profileStyles.TEXT_MUTED || '#7A5368'}
              />
            </View>
            <View style={profileStyles.formGroup}>
              <Text style={profileStyles.label}>Mã bưu điện *</Text>
              <TextInput
                style={profileStyles.input}
                placeholder="Mã bưu điện *"
                value={formData.zipcode}
                onChangeText={(value) => handleFormChange('zipcode', value)}
                keyboardType="numeric"
                placeholderTextColor={profileStyles.TEXT_MUTED || '#7A5368'}
              />
            </View>
            <View style={[profileStyles.rowInput, { marginBottom: 18 }]}>
              <Text style={profileStyles.label}>Đặt làm mặc định</Text>
              <Switch
                value={formData.is_default}
                onValueChange={(value) => handleFormChange('is_default', value)}
                trackColor={{ true: profileStyles.PRIMARY || '#FF4D79' }}
                thumbColor="#FFF"
              />
            </View>
            <TouchableOpacity
              style={[
                profileStyles.primaryButton, 
                { 
                  backgroundColor: profileStyles.PRIMARY || '#FF4D79',
                  paddingVertical: 16
                }
              ]}
              onPress={handleCreateAddress}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={profileStyles.primaryButtonText}>Thêm địa chỉ</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addressItem: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: profileStyles.PRIMARY_LIGHT || '#FFE6F0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: profileStyles.BORDER || '#FFD6E8',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
});