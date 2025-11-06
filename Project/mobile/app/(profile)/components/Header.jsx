import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/ProfileStyles';

const Header = ({ user }) => {
  const router = useRouter();

  const handleAvatarPress = () => {
    router.push('/(profile)/components/updateProfile');
  };

  return (
    <View style={styles.header}>
      {/* User info: Avatar tap để update */}
      <View style={styles.userInfoLeft}>
        <TouchableOpacity onPress={handleAvatarPress}> {/* Wrap avatar */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </View>
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{user.name}</Text>
          {/* Row ngang: Followers + space + Following turn right avatar */}
          <View style={styles.followRow}>
            <Text style={styles.followersText}>{user.followers} Người theo dõi</Text>
            <View style={styles.followSpace} />
            <Text style={styles.followingText}>{user.following} Đang theo dõi</Text>
          </View>
        </View>
      </View>

      {/* 3 icons conner right, floating */}
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