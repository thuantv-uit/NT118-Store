import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../theme/colors';
import { styles } from '../styles/ProfileStyles';

const BottomNav = () => (
  <View style={styles.bottomNav}>
    <TouchableOpacity style={[styles.navItem, { borderTopWidth: 3, borderTopColor: colors.notification.dot }]}>
      <Icon name="home-outline" size={24} color={colors.primary.dark} />
      <Text style={styles.navLabel}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Icon name="grid-outline" size={24} color={colors.primary.dark} />
      <Text style={styles.navLabel}>Categories</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Icon name="cart-outline" size={24} color={colors.primary.dark} />
      <Text style={styles.navLabel}>Cart</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.navItem, { borderTopWidth: 3, borderTopColor: colors.notification.dot }]}>
      <Icon name="person" size={24} color={colors.notification.dot} />
      <Text style={[styles.navLabel, { color: colors.notification.dot }]}>Account</Text>
    </TouchableOpacity>
  </View>
);

export default BottomNav;