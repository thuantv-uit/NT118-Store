import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/ProfileStyles';

const UtilitiesSection = ({ utilities }) => {
  const navigation = useNavigation();

  const handleUtilityPress = (item) => {
    switch (item.label) {
      case 'Giao hàng':
        navigation.navigate('(profile)/components/DeliveryScreen'); // Navigate đến trang Giao hàng
        break;
      case 'Cài đặt':
        // Logic cho Cài đặt (có thể navigate hoặc alert)
        console.log('Clicked on Cài đặt');
        // Ví dụ: navigation.navigate('Settings');
        break;
      case 'Danh sách yêu thích':
        // Logic cho Chính sách
        // console.log('Clicked on Chính sách');
        // Ví dụ: navigation.navigate('Policy');
        navigation.navigate('(buyer)/components/WishListScreen');
        break;
      case 'Thanh toán':
        navigation.navigate('(profile)/components/WalletScreen');
        break;
      case 'Bảo mật':
        // Logic cho Bảo mật
        console.log('Clicked on Bảo mật');
        // Ví dụ: navigation.navigate('Security');
        break;
      case 'Hỗ trợ':
        // Logic cho Hỗ trợ
        console.log('Clicked on Hỗ trợ');
        // Ví dụ: navigation.navigate('Support');
        break;
      default:
        console.log(`Clicked on ${item.label}, but no action defined.`);
        break;
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tiện ích</Text>
      <View style={styles.utilitiesContainer}>
        {/* Dòng 1: 3 items dọc */}
        <View style={styles.utilityRow}>
          {utilities.slice(0, 3).map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.utilityItem} 
              onPress={() => handleUtilityPress(item)}
              activeOpacity={0.8}
            >
              <View style={styles.utilityIcon}>
                <MaterialIcons name={item.icon} size={32} color="#FF6B9D" />
              </View>
              <Text style={styles.utilityLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Dòng 2: 3 items dọc */}
        <View style={styles.utilityRow}>
          {utilities.slice(3, 6).map((item, index) => (
            <TouchableOpacity 
              key={index + 3} 
              style={styles.utilityItem} 
              onPress={() => handleUtilityPress(item)}
              activeOpacity={0.8}
            >
              <View style={styles.utilityIcon}>
                <MaterialIcons name={item.icon} size={32} color="#FF6B9D" />
              </View>
              <Text style={styles.utilityLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default UtilitiesSection;