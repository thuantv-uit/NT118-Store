import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from "../../../constants/api";
import { styles } from '../_styles/ProfileStyles';

const UpdateProfileScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    phone_number: '',
    role: 'buyer',
  });

  const [loading, setLoading] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const baseURL = API_URL;

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

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

        if (data.avatar) {
          setSelectedAvatar(data.avatar);
        }
        setProfileExists(true);
      } else if (response.status === 404) {
        setProfileExists(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Không thể tải hồ sơ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedAvatar(result.assets[0].uri);
      Alert.alert("Thành công", "Đã chọn avatar!");
    }
  };

  const handleSave = async () => {
    if (!userId) {
      Alert.alert('Error', 'User chưa đăng nhập.');
      return;
    }

    if (!formData.first_name || !formData.last_name || !formData.phone_number || !formData.role) {
      Alert.alert('Error', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("first_name", formData.first_name);
      formPayload.append("last_name", formData.last_name);
      formPayload.append("phone_number", formData.phone_number);
      formPayload.append("role", formData.role);

      const fallbackAvatar =
        selectedAvatar ||
        user?.imageUrl ||
        'https://res.cloudinary.com/demo/image/upload/v1699999999/default-avatar.png';

      if (selectedAvatar && !selectedAvatar.startsWith('http')) {
        const fileName = selectedAvatar.split('/').pop();
        const fileType = fileName?.includes('.png') ? 'image/png' : 'image/jpeg';

        formPayload.append("avatar", {
          uri: selectedAvatar,
          type: fileType,
          name: fileName,
        });
      } else {
        formPayload.append("avatar", fallbackAvatar);
      }

      let response;
      if (!profileExists) {
        formPayload.append("id", userId);
        formPayload.append("password", 'default');
        formPayload.append("address", '');

        response = await fetch(`${baseURL}/customers`, {
          method: 'POST',
          body: formPayload,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await fetch(`${baseURL}/customers/${userId}`, {
          method: 'PUT',
          body: formPayload,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.ok) {
        try {
          await user.update({
            firstName: formData.first_name,
            lastName: formData.last_name,
            publicMetadata: {
              phone_number: formData.phone_number,
              role: formData.role,
            },
          });
        } catch (clerkErr) {
          console.warn('Không thể đồng bộ Clerk:', clerkErr);
        }

        setProfileExists(true);
        Alert.alert('Success', 'Cập nhật hồ sơ thành công!');
        router.back();
      } else {
        const err = await response.json();
        Alert.alert('Error', err.message || 'Có lỗi xảy ra.');
      }
    } catch (error) {
      Alert.alert('Error', 'Không thể kết nối server.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => router.back();

  const removeAvatar = () => {
    setSelectedAvatar(null);
    Alert.alert("Đã xóa", "Avatar sẽ được xóa khi lưu.");
  };

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
        {/* Header */}
        <View style={styles.updateHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#FF4D79" />
          </TouchableOpacity>
          <Text style={styles.updateTitle}>Sửa hồ sơ</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveBtnHeader}>
            <Text style={styles.saveTextHeader}>{loading ? 'Đang lưu...' : 'Lưu'}</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Avatar</Text>
          <TouchableOpacity onPress={pickAvatar} disabled={loading} style={styles.avatarUploadButton}>
            <Icon name="camera-outline" size={24} color="#FF4D79" />
            <Text style={styles.avatarUploadText}>Chọn ảnh avatar</Text>
          </TouchableOpacity>

          {selectedAvatar && (
            <View style={styles.avatarPreview}>
              <Image source={{ uri: selectedAvatar }} style={styles.avatarImage} />
              <TouchableOpacity onPress={removeAvatar} style={styles.removeAvatarButton}>
                <Icon name="close-circle" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Họ và Tên</Text>
          <View style={styles.rowInput}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              value={formData.last_name}
              onChangeText={(t) => setFormData({ ...formData, last_name: t })}
              placeholder="Họ"
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              value={formData.first_name}
              onChangeText={(t) => setFormData({ ...formData, first_name: t })}
              placeholder="Tên"
            />
          </View>
        </View>

        {/* Phone */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={formData.phone_number}
            onChangeText={(t) => setFormData({ ...formData, phone_number: t })}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
        </View>

        {/* Role */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Vai trò</Text>
          <View style={styles.rowInput}>
            {['buyer', 'seller', 'shipper'].map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.inputHalf,
                  {
                    backgroundColor: formData.role === r ? '#FF4D79' : '#E0E0E0',
                    borderRadius: 8,
                    margin: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
                onPress={() => setFormData({ ...formData, role: r })}
              >
                <Text
                  style={{
                    color: formData.role === r ? '#FFF' : '#000',
                    fontWeight: formData.role === r ? 'bold' : 'normal',
                  }}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;
