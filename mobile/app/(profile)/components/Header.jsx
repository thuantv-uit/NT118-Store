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
      } else if (response.status === 404) {
        setAvatarUrl(null);
        setFirstName('');
        setLastName('');
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setAvatarUrl(null);
      setFirstName('');
      setLastName('');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleAvatarPress = () => {
    router.push('/(profile)/components/updateProfile');
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
        <TouchableOpacity style={styles.iconBtn}>
          <Icon name="settings-outline" size={24} color="#FF6B9D" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Icon name="cart-outline" size={24} color="#FF6B9D" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Icon name="chatbubble-outline" size={24} color="#FF6B9D" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;