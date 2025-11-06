import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/ProfileStyles';

const OrdersSection = ({ tabs, onTabPress }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Đơn mua</Text>
    <View style={styles.tabRow}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tabItem, { borderRightWidth: index < 2 ? 1 : 0, borderRightColor: '#E0E0E0' }]}
          onPress={() => onTabPress(tab.label)}
        >
          <Icon name={tab.icon} size={28} color={tab.color} />
          <Text style={styles.tabLabel}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default OrdersSection;