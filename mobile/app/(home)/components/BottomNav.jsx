import { usePathname, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../theme/colors';
import { styles } from '../styles/HomeStyles';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname() || '/(home)'; // Fallback nếu pathname undefined

  const navItems = [
    { route: '/(home)', icon: 'home', label: 'Home', activeColor: colors.primary.main },
    { route: '/(buyer)', icon: 'cart-outline', label: 'Cart', activeColor: colors.primary.main },
    { route: '/(buyer)/chat', icon: 'chatbubble-ellipses', label: 'Chat', activeColor: colors.primary.main },
    { route: '/(profile)', icon: 'person', label: 'Account', activeColor: colors.primary.main },
  ];

  const handleNavPress = (route) => {
    router.push(route);
  };

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = pathname === item.route || pathname.startsWith(item.route);
        const iconColor = isActive ? item.activeColor : colors.text.light;
        const labelColor = isActive ? item.activeColor : colors.text.light;

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
