import { useUser } from "@clerk/clerk-expo";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from "../../../constants/api";
import { styles } from '../styles/ProfileStyles';

const Header = ({ user }) => {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const userId = clerkUser?.id;
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('buyer'); // State cho role, fallback buyer
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    } else {
      setLoadingProfile(false);
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await fetch(`${API_URL}/customers/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(data.avatar || null);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setRole(data.role || 'buyer'); // Fetch role từ API, fallback buyer nếu không có
      } else if (response.status === 404) {
        setAvatarUrl(null);
        setFirstName('');
        setLastName('');
        setRole('buyer');
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setAvatarUrl(null);
      setFirstName('');
      setLastName('');
      setRole('buyer');
    } finally {
      setLoadingProfile(false);
    }
  };

  // Function mới: Xử lý go back về trang trước (thường là home)
  const handleGoBack = () => {
    router.back();  // Quay lại trang trước
  };

  const handleAvatarPress = () => {
    router.push('/(profile)/components/updateProfile');
  };

  // Function: Xử lý click button dashboard dựa trên role
  const handleDashboardPress = () => {
    if (role === 'seller') {
      router.push('/(seller)'); // Adjust route nếu cần
    } else if (role === 'shipper') {
      router.push('/(shipper)'); // Adjust route nếu cần
    } else {
      // Buyer: Không làm gì
      console.log('Buyer - No action');
    }
  };

  const displayName = firstName && lastName ? `${lastName} ${firstName}` : user?.name || 'Tên người dùng';

  const renderAvatar = () => {
    if (loadingProfile) {
      return (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Icon name="person-outline" size={40} color="#E0E0E0" />
        </View>
      );
    }
    if (avatarUrl) {
      return (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      );
    }
    return (
      <View style={[styles.avatar, styles.avatarPlaceholder]}>
        <Icon name="person-outline" size={40} color="#E0E0E0" />
      </View>
    );
  };

  return (
    <View style={styles.header}>
      {/* Button back ở đầu header, bên trái */}
      <TouchableOpacity onPress={handleGoBack} style={styles.backButtonContainer}>
        <Icon name="arrow-back" size={24} color="#6D4C41" />
      </TouchableOpacity>

      <View style={styles.userInfoLeft}>
        <TouchableOpacity onPress={handleAvatarPress}>
          <View style={styles.avatarContainer}>
            {renderAvatar()}
          </View>
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text style={styles.userName} numberOfLines={1}>
            {displayName}
          </Text>
          <View style={styles.followRow}>
            <Text style={styles.followersText} numberOfLines={1}>
              {`${user?.followers || 0} Người theo dõi`}
            </Text>
            <View style={styles.followSpace} />
            <Text style={styles.followingText} numberOfLines={1}>
              {`${user?.following || 0} Đang theo dõi`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.headerIcons}>
        {/* Chỉ giữ lại button dashboard */}
        <TouchableOpacity style={styles.iconBtn} onPress={handleDashboardPress} disabled={loadingProfile}>
          <Icon name="construct" size={24} color="#FF6B9D" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;