import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../_styles/ProfileStyles';

const LogoutButton = ({ onPress }) => (
  <TouchableOpacity style={styles.logoutBtn} onPress={onPress}>
    <Text style={styles.logoutText}>Đăng xuất</Text>
  </TouchableOpacity>
);

export default LogoutButton;
