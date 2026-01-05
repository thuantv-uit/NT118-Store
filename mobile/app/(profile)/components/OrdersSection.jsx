import { useNavigation } from '@react-navigation/native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from 'react-native-vector-icons';
import useCustomerProfile from '../../../utlis/useCustomerProfile';
import { styles } from '../_styles/ProfileStyles';

const OrdersSection = () => {
  /* ===================== PROFILE HOOK ===================== */
  const { profile } = useCustomerProfile();
  const role = profile?.role ?? 'UNKNOWN_ROLE';

  /* ===================== NAVIGATION HOOK ===================== */
  // Gọi hook này LUÔN, trước if check (tuân thủ Rules of Hooks)
  const navigation = useNavigation();

  // 🔐 Role check: Chỉ buyer mới HIỂN THỊ (không ảnh hưởng đến hooks)
  if (role !== 'buyer') {
    return null;  // Ẩn section nếu không phải buyer
  }

  // Hardcode tabs với labels và icons mới, thêm "Hủy đơn"
  const tabs = [
    {
      label: 'Đơn hàng mua',
      icon: 'cart-outline',
      color: '#FF4D79',
    },
    {
      label: 'Chờ xác nhận',
      icon: 'time-outline',
      color: '#FF7BAC',
    },
    {
      label: 'Giao hàng',
      icon: 'bicycle-outline',
      color: '#FF9FC3',
    },
    {
      label: 'Hủy đơn',
      icon: 'close-circle-outline',
      color: '#C2185B',
    },
    {
      label: 'Lịch sử giao hàng',
      icon: 'archive-outline',
      color: '#7A5368',
    },
  ];

  const handleTabPress = (label) => {
    // Thêm log để track (có thể xóa ở production)
    console.log(`[OrdersSection] Tab pressed: ${label} for role: ${role}`);

    switch (label) {
      case 'Đơn hàng mua':
        // Navigate đến màn hình hiển thị tất cả đơn hàng
        navigation.navigate('(buyer)/components/OrderTrackingScreen');
        break;
      case 'Chờ xác nhận':
        // Navigate đến màn hình đơn hàng chờ xác nhận (có thể filter status='pending')
        // navigation.navigate('OrderPendingScreen', { buyerId: 'current_buyer_id' });
        break;
      case 'Giao hàng':
        // Navigate đến màn hình đơn hàng đang giao (filter status='processing' hoặc 'shipped')
        // navigation.navigate('OrderShippingScreen', { buyerId: 'current_buyer_id' });
        break;
      case 'Hủy đơn':
        // Navigate đến màn hình đơn hàng bị hủy (filter status='cancelled')
        // navigation.navigate('CancelledOrdersScreen', { buyerId: 'current_buyer_id' });
        break;
      case 'Lịch sử giao hàng':
        // Navigate đến màn hình đơn hàng hoàn thành (filter status='delivered')
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.tabRow, { paddingHorizontal: 16 }]} // Thêm padding để scroll mượt
        snapToInterval={90} // Adjust theo width của tabItem để snap đẹp (mỗi tab ~90px)
        decelerationRate="fast"
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.label} // Sử dụng label làm key để ổn định hơn
            style={[
              styles.tabItem, 
              { 
                borderRightWidth: index < tabs.length - 1 ? 1 : 0, // Border cho tất cả trừ item cuối
                borderRightColor: '#E0E0E0',
                width: 90, // Width cố định để các ô icon bằng nhau (adjust nếu cần)
                alignItems: 'center', // Center nội dung
                justifyContent: 'center',
              }
            ]}
            onPress={() => handleTabPress(tab.label)}
            activeOpacity={0.8} // Feedback touch
          >
            <Ionicons name={tab.icon} size={28} color={tab.color} />
            <Text 
              style={styles.tabLabel}
              numberOfLines={2} // Cho phép wrap xuống hàng nếu label dài (3-4 chữ/từ)
              textAlign="center" // Căn giữa text
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default OrdersSection;