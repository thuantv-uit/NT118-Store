import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../_styles/ProfileStyles';

const BottomNav = () => (
  <View style={styles.bottomNav}>
    <TouchableOpacity style={[styles.navItem, { borderTopWidth: 3, borderTopColor: '#FF4D79' }]}>
      <Icon name="home-outline" size={24} color="#7A5368" />
      <Text style={styles.navLabel}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Icon name="grid-outline" size={24} color="#7A5368" />
      <Text style={styles.navLabel}>Categories</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Icon name="cart-outline" size={24} color="#7A5368" />
      <Text style={styles.navLabel}>Cart</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.navItem, { borderTopWidth: 3, borderTopColor: '#FF4D79' }]}>
      <Icon name="person" size={24} color="#FF4D79" />
      <Text style={[styles.navLabel, { color: '#FF4D79' }]}>Account</Text>
    </TouchableOpacity>
  </View>
);

export default BottomNav;
