import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/ProfileStyles';

const BottomNav = () => (
  <View style={styles.bottomNav}>
    <TouchableOpacity style={[styles.navItem, { borderTopWidth: 3, borderTopColor: '#FF6B9D' }]}>
      <Icon name="home-outline" size={24} color="#8D6E63" />
      <Text style={styles.navLabel}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Icon name="grid-outline" size={24} color="#8D6E63" />
      <Text style={styles.navLabel}>Categories</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Icon name="cart-outline" size={24} color="#8D6E63" />
      <Text style={styles.navLabel}>Cart</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.navItem, { borderTopWidth: 3, borderTopColor: '#FF6B9D' }]}>
      <Icon name="person" size={24} color="#FF6B9D" />
      <Text style={[styles.navLabel, { color: '#FF6B9D' }]}>Account</Text>
    </TouchableOpacity>
  </View>
);

export default BottomNav;