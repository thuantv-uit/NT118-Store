import { useUser } from "@clerk/clerk-expo";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/ProfileStyles';

const UpdateProfileScreen = () => {
  const router = useRouter();
  const { user } = useUser(); // get user from Clerk
  const userId = user?.id; // userId from Clerk user object
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    phone_number: '',
    role: 'buyer', // defalut buyer
  });
  const [loading, setLoading] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const baseURL = 'http://192.168.1.67:5001/api';

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]); // Depend on userId to load when user avairable

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/customers/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          last_name: data.last_name || '',
          first_name: data.first_name || '',
          phone_number: data.phone_number || '',
          role: data.role || 'buyer',
        });
        setProfileExists(true);
      } else if (response.status === 404) {
        setProfileExists(false); // Chưa có profile, sẵn sàng POST
      }
    } catch (error) {
      Alert.alert('Error', 'Do not load profile. Please try.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Kiểm tra userId trước
    if (!userId) {
      Alert.alert('Error', 'User do not authentic. Please try.');
      return;
    }

    // Validation
    if (!formData.last_name || !formData.first_name || !formData.phone_number || !formData.role) {
      Alert.alert('Error', 'Please fill full information.');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (!profileExists) {
        // First: POST create
        response = await fetch(`${baseURL}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: userId,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            role: formData.role,
          }),
        });
      } else {
        // After: PUT update
        response = await fetch(`${baseURL}/customers/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            role: formData.role,
          }),
        });
      }

      if (response.ok) {
        Alert.alert('Success', 'Update pfofile!');
        router.back();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Have error happen.');
      }
    } catch (error) {
      Alert.alert('Error', 'Do not connect serve. Please try.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Nếu user chưa load xong, show loading
  if (!user) {
    return (
      <SafeAreaView style={styles.updateContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading user information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.updateContainer}>
      <ScrollView contentContainerStyle={styles.updateScroll}>
        {/* Header: Back + Title + Lưu */}
        <View style={styles.updateHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#FF6B9D" />
          </TouchableOpacity>
          <Text style={styles.updateTitle}>Sửa hồ sơ</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveBtnHeader}>
            <Text style={styles.saveTextHeader}>{loading ? 'Đang lưu...' : 'Lưu'}</Text>
          </TouchableOpacity>
        </View>

        {/* Form: Họ và Tên */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Họ và Tên</Text>
          <View style={styles.rowInput}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              value={formData.last_name}
              onChangeText={(text) => setFormData({ ...formData, last_name: text })}
              placeholder="Họ"
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              value={formData.first_name}
              onChangeText={(text) => setFormData({ ...formData, first_name: text })}
              placeholder="Tên"
            />
          </View>
        </View>

        {/* Số điện thoại */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={formData.phone_number}
            onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
        </View>

        {/* Role */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Vai trò</Text>
          <View style={styles.input}> {/* Wrap Picker trong View để match style */}
            {/* Role - Thay thế Picker bằng buttons clickable để tránh lỗi import/package */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Vai trò</Text>
            <View style={styles.rowInput}> {/* Hoặc dùng styles.gioiTinhContainer nếu có */}
              {['buyer', 'seller', 'shipper'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.inputHalf,
                    {
                      backgroundColor: formData.role === r ? '#FF6B9D' : '#E0E0E0',
                      borderRadius: 8, // Thêm border radius cho đẹp
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 2,
                    }
                  ]}
                  onPress={() => setFormData({ ...formData, role: r })}
                >
                  <Text
                    style={{
                      color: formData.role === r ? '#FFF' : '#000',
                      fontSize: 14,
                      fontWeight: formData.role === r ? 'bold' : 'normal',
                    }}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)} {/* Capitalize label */}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;