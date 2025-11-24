import { usePathname, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/HomeStyles';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname() || '/(home)'; // Fallback nếu pathname undefined

  const navItems = [
    { route: '/(home)', icon: 'home', label: 'Home', activeColor: '#FF8A65' },
    // { route: '/categories', icon: 'grid', label: 'Categories', activeColor: '#FF8A65' },
    { route: '/(buyer)', icon: 'cart-outline', label: 'Cart', activeColor: '#FF8A65' }, // Thêm tab Cart ở giữa
    // { route: '/chat', icon: 'chatbubble-ellipses', label: 'Chat', activeColor: '#FF8A65' },
    { route: '/(profile)', icon: 'person', label: 'Account', activeColor: '#FF8A65' },
    { route: '(home)/components/Conversations', icon: 'chatbubble-ellipses', label: 'Chat', activeColor: '#FF8A65' }, // Thêm tab Chat
  ];

  const handleNavPress = (route) => {
    router.push(route);
  };

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = pathname === item.route || pathname.startsWith(item.route);
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