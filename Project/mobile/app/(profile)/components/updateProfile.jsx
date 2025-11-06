import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { mockUser } from '../data/mockData';
import { styles } from '../styles/ProfileStyles';

const UpdateProfileScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ho: 'Huyền',
    ten: 'My',
    email: 'ABC@gmail.com',
    phone: '(+84) 123 456 789',
    ngaySinh: '01/01/2004',
    gioiTinh: 'Nữ',
    avatar: mockUser.avatar,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần quyền truy cập thư viện ảnh!');
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, avatar: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      Alert.alert('Thành công', 'Cập nhật hồ sơ hoàn tất!');
      router.back();
      setLoading(false);
    }, 1000);
  };

  const toggleGioiTinh = (value) => {
    setFormData({ ...formData, gioiTinh: value ? 'Nam' : 'Nữ' });
  };

  const handleBack = () => {
    router.back();
  };

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

        {/* Avatar */}
        <TouchableOpacity onPress={pickImage} style={styles.avatarEditContainer}>
          <Image source={{ uri: formData.avatar }} style={styles.avatarEdit} />
          <View style={styles.editOverlay}>
            <Icon name="camera-outline" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Form: Họ và Tên */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Họ và Tên</Text>
          <View style={styles.rowInput}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              value={formData.ho}
              onChangeText={(text) => setFormData({ ...formData, ho: text })}
              placeholder="Họ"
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              value={formData.ten}
              onChangeText={(text) => setFormData({ ...formData, ten: text })}
              placeholder="Tên"
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Nhập email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Số điện thoại */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
        </View>

        {/* Ngày sinh */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ngày sinh</Text>
          <TextInput
            style={styles.input}
            value={formData.ngaySinh}
            onChangeText={(text) => setFormData({ ...formData, ngaySinh: text })}
            placeholder="DD/MM/YYYY"
            keyboardType="numeric"
          />
        </View>

        {/* Giới tính */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Giới tính</Text>
          <View style={styles.gioiTinhContainer}>
            <View style={styles.gioiTinhOption}>
              <Text style={styles.gioiTinhLabel}>Nữ</Text>
              <Switch
                value={formData.gioiTinh === 'Nữ'}
                onValueChange={toggleGioiTinh}
                trackColor={{ false: '#E0E0E0', true: '#FF6B9D' }}
                thumbColor={formData.gioiTinh === 'Nữ' ? '#FFF' : '#F4F3F4'}
              />
            </View>
            <View style={styles.gioiTinhOption}>
              <Text style={styles.gioiTinhLabel}>Nam</Text>
              <Switch
                value={formData.gioiTinh === 'Nam'}
                onValueChange={toggleGioiTinh}
                trackColor={{ false: '#E0E0E0', true: '#FF6B9D' }}
                thumbColor={formData.gioiTinh === 'Nam' ? '#FFF' : '#F4F3F4'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;