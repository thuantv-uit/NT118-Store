import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/HomeStyles';

export default function BottomNav({ navigation }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="home" size={22} color="#FF8A65" />
        <Text style={styles.navLabel}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="grid" size={22} color="#8D6E63" />
        <Text style={styles.navLabel}>Categories</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="chatbubble-ellipses" size={22} color="#8D6E63" />
        <Text style={styles.navLabel}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="person" size={22} color="#8D6E63" />
        <Text style={styles.navLabel}>Account</Text>
      </TouchableOpacity>
    </View>
  );
}