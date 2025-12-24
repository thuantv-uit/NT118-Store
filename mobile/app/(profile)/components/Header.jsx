import { useUser } from "@clerk/clerk-expo";
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../_styles/ProfileStyles';

const Header = ({ profile, loadingProfile, onEdit }) => {
  const router = useRouter();
  const { user: clerkUser } = useUser();

  const role = profile?.role || 'buyer';
  const displayName =
    (profile?.last_name || profile?.first_name)
      ? `${profile?.last_name || ''} ${profile?.first_name || ''}`.trim()
      : clerkUser?.fullName || 'Tên người dùng';
  const avatarUrl = profile?.avatar || clerkUser?.imageUrl || null;

  const handleGoBack = () => {
    router.back();
  };

  const handleAvatarPress = () => {
    if (onEdit) onEdit();
    else router.push('/(profile)/components/updateProfile');
  };

  const handleDashboardPress = () => {
    if (role === 'seller') {
      router.push('/(seller)');
    } else if (role === 'shipper') {
      router.push('/(shipper)');
    }
  };

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
      <TouchableOpacity onPress={handleGoBack} style={styles.backButtonContainer}>
        <Icon name="arrow-back" size={22} color="#FF4D79" />
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
              {`${profile?.followers || 0} Người theo dõi`}
            </Text>
            <View style={styles.followSpace} />
            <Text style={styles.followingText} numberOfLines={1}>
              {`${profile?.following || 0} Đang theo dõi`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;
