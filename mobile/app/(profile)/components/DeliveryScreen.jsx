// DeliveryScreen.jsx
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
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../constants/api';
import { colors } from '../../../theme/colors';

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
    <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: colors.border.light }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>{item.name || 'Địa chỉ mặc định'}</Text>
        {item.is_default && <Text style={{ color: colors.status.success, fontSize: 12 }}>Mặc định</Text>}
      </View>
      <Text>{item.address}</Text>
      <Text style={{ fontSize: 12, color: colors.text.tertiary }}>{item.city}, {item.state}, {item.country} - {item.zipcode}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteAddress(item.id)}
        style={{ marginTop: 10, padding: 5, backgroundColor: colors.secondary.lightPink, borderRadius: 5, alignSelf: 'flex-start' }}
        disabled={deletingId === item.id}
      >
        <Text style={{ color: 'red' }}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && addresses.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary.dark} />
        <Text>Đang tải địa chỉ...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: colors.background.tertiary, borderBottomWidth: 1, borderBottomColor: colors.border.light }}>
          <TouchableOpacity onPress={handleBack} style={{ marginRight: 10 }}>
            <Icon name="arrow-back" size={24} color={colors.primary.dark} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1 }}>Thông tin giao hàng</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {error && (
            <View style={{ padding: 15, backgroundColor: colors.secondary.lightPink, margin: 10, borderRadius: 5 }}>
              <Text style={{ color: colors.status.error }}>{error}</Text>
              <TouchableOpacity onPress={fetchAddresses} style={{ marginTop: 5 }}>
                <Text style={{ color: 'blue' }}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Danh sách địa chỉ */}
          <View style={{ padding: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Danh sách địa chỉ</Text>
            {addresses.length === 0 ? (
              <Text style={{ color: colors.text.lighter, textAlign: 'center', marginTop: 20 }}>Chưa có địa chỉ nào. Thêm địa chỉ mới bên dưới!</Text>
            ) : (
              <FlatList
                data={addresses}
                renderItem={renderAddressItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            )}
          </View>

          {/* Form thêm địa chỉ mới */}
          <View style={{ padding: 15, borderTopWidth: 1, borderTopColor: colors.border.light }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Thêm địa chỉ mới</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border.light, padding: 10, borderRadius: 5, marginBottom: 10 }}
              placeholder="Tên địa chỉ (tùy chọn)"
              value={formData.name}
              onChangeText={(value) => handleFormChange('name', value)}
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border.light, padding: 10, borderRadius: 5, marginBottom: 10 }}
              placeholder="Địa chỉ *"
              value={formData.address}
              onChangeText={(value) => handleFormChange('address', value)}
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border.light, padding: 10, borderRadius: 5, marginBottom: 10 }}
              placeholder="Thành phố *"
              value={formData.city}
              onChangeText={(value) => handleFormChange('city', value)}
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border.light, padding: 10, borderRadius: 5, marginBottom: 10 }}
              placeholder="Tỉnh/Thành *"
              value={formData.state}
              onChangeText={(value) => handleFormChange('state', value)}
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border.light, padding: 10, borderRadius: 5, marginBottom: 10 }}
              placeholder="Quốc gia *"
              value={formData.country}
              onChangeText={(value) => handleFormChange('country', value)}
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border.light, padding: 10, borderRadius: 5, marginBottom: 10 }}
              placeholder="Mã bưu điện *"
              value={formData.zipcode}
              onChangeText={(value) => handleFormChange('zipcode', value)}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text>Đặt làm mặc định</Text>
              <Switch
                value={formData.is_default}
                onValueChange={(value) => handleFormChange('is_default', value)}
              />
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary.dark,
                padding: 15,
                borderRadius: 5,
                alignItems: 'center',
              }}
              onPress={handleCreateAddress}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color={colors.text.white} />
              ) : (
                <Text style={{ color: colors.text.white, fontWeight: 'bold' }}>Thêm địa chỉ</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}