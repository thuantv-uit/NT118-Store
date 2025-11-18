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
import { colors } from '../../../theme/colors';
import { styles } from '../styles/ProfileStyles';

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
      Alert.alert('Error', 'Do not load profile. Please try.');
    } finally {
      setLoading(false);
    }
  };

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh để chọn avatar!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedAvatar(result.assets[0].uri);
      Alert.alert("Thành công", "Đã chọn ảnh avatar! Sẽ được upload khi lưu.");
    }
  };

  const handleSave = async () => {
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
      const formPayload = new FormData();
      formPayload.append("first_name", formData.first_name);
      formPayload.append("last_name", formData.last_name);
      formPayload.append("phone_number", formData.phone_number);
      formPayload.append("role", formData.role);

      if (selectedAvatar && !selectedAvatar.startsWith('http')) {
        const fileName = selectedAvatar.split('/').pop();
        const fileType = fileName.includes('.png') ? 'image/png' : 'image/jpeg';
        formPayload.append("avatar", {
          uri: selectedAvatar,
          type: fileType,
          name: fileName,
        });
      } else if (selectedAvatar && selectedAvatar.startsWith('http')) {
        formPayload.append("avatar", selectedAvatar);
      }

      let response;
      if (!profileExists) {
        // First: POST create with id
        formPayload.append("id", userId);
        formPayload.append("email", user?.emailAddresses[0]?.emailAddress || '');
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
        // After: PUT update
        response = await fetch(`${baseURL}/customers/${userId}`, {
          method: 'PUT',
          body: formPayload,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.ok) {
        Alert.alert('Success', 'Update profile!');
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

  // Function delete avatar
  const removeAvatar = () => {
    setSelectedAvatar(null);
    Alert.alert("Đã xóa", "Avatar sẽ được xóa khi lưu.");
  };

  // If user has not loaded yet, show loading
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
            <Icon name="arrow-back" size={24} color={colors.notification.dot} />
          </TouchableOpacity>
          <Text style={styles.updateTitle}>Sửa hồ sơ</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveBtnHeader}>
            <Text style={styles.saveTextHeader}>{loading ? 'Đang lưu...' : 'Lưu'}</Text>
          </TouchableOpacity>
        </View>

        {/* Part upload avatar */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Avatar</Text>
          <TouchableOpacity onPress={pickAvatar} disabled={loading} style={styles.avatarUploadButton}>
            <Icon name="camera-outline" size={24} color={colors.notification.dot} />
            <Text style={styles.avatarUploadText}>Chọn ảnh avatar</Text>
          </TouchableOpacity>
          {selectedAvatar && (
            <View style={styles.avatarPreview}>
              <Image source={{ uri: selectedAvatar }} style={styles.avatarImage} />
              <TouchableOpacity onPress={removeAvatar} style={styles.removeAvatarButton}>
                <Icon name="close-circle" size={24} color={colors.status.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Form: Firstname and Lastname */}
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

        {/* SDT */}
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
          <View style={styles.rowInput}>
            {['buyer', 'seller', 'shipper'].map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.inputHalf,
                  {
                    backgroundColor: formData.role === r ? colors.notification.dot : colors.border.light,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 2,
                  }
                ]}
                onPress={() => setFormData({ ...formData, role: r })}
              >
                <Text
                  style={{
                    color: formData.role === r ? colors.text.white : colors.shadow.black,
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;