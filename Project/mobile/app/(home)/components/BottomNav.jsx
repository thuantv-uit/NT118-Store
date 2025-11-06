import { usePathname, useRouter } from 'expo-router'; // Thêm usePathname để check active
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/HomeStyles';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname(); // Lấy route hiện tại để highlight tab

  const navItems = [
    { route: '/(home)', icon: 'home', label: 'Home', activeColor: '#FF8A65' },
    { route: '/categories', icon: 'grid', label: 'Categories', activeColor: '#FF8A65' },
    { route: '/chat', icon: 'chatbubble-ellipses', label: 'Chat', activeColor: '#FF8A65' },
    { route: '/(profile)', icon: 'person', label: 'Account', activeColor: '#FF8A65' },
  ];

  const handleNavPress = (route) => {
    router.push(route); // Chuyển hướng (push) sang route đó
  };

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = pathname === item.route;
        const iconColor = isActive ? item.activeColor : '#8D6E63';
        const labelColor = isActive ? item.activeColor : '#8D6E63';

        return (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            onPress={() => handleNavPress(item.route)}
          >
            <Icon name={item.icon} size={22} color={iconColor} />
            <Text style={[styles.navLabel, { color: labelColor }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}