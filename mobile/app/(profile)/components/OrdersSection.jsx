import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/ProfileStyles';

const OrdersSection = ({ tabs }) => {
  const navigation = useNavigation();

  const handleTabPress = (label) => {
    switch (label) {
      case 'Đơn hàng mua':
        // Navigate đến màn hình hiển thị tất cả đơn hàng
        navigation.navigate('(buyer)/components/OrderTrackingScreen');
        break;
      case 'Đang giao':
        // Navigate đến màn hình theo dõi đơn hàng đang giao (liên kết với OrderTrackingScreen)
        // navigation.navigate('OrderTracking', { buyerId: 'current_buyer_id' }); // Thay buyerId bằng logic thực tế nếu cần
        break;
      case 'Lịch sử':
        // Navigate đến màn hình đơn hàng hoàn thành
        // navigation.navigate('(profile)/components/OrdersCompletedScreen');
        break;
      default:
        console.log(`Clicked on tab: ${label}, but no navigation defined.`);
        break;
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Đơn mua</Text>
      <View style={styles.tabRow}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.label || index} // Sử dụng label làm key nếu có, fallback index
            style={[
              styles.tabItem, 
              { 
                borderRightWidth: index < tabs.length - 1 ? 1 : 0, // Sửa: border cho tất cả trừ item cuối
                borderRightColor: '#E0E0E0' 
              }
            ]}
            onPress={() => handleTabPress(tab.label)}
            activeOpacity={0.8} // Thêm feedback touch
          >
            <Icon name={tab.icon} size={28} color={tab.color} />
            <Text style={styles.tabLabel}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default OrdersSection;