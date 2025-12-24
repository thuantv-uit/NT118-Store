import { useUser } from '@clerk/clerk-expo';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../constants/api';
import useCustomerProfile from '../../../utlis/useCustomerProfile';
import { styles } from '../_styles/HomeStyles';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname() || '/(home)'; // Fallback nếu pathname undefined
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const { profile } = useCustomerProfile();

  const navItems = useMemo(() => {
    const base = [
      { key: 'home', route: '/(home)', icon: 'home', label: 'Home', activeColor: '#FF4D79' },
      { key: 'cart', route: '/(buyer)', icon: 'cart-outline', label: 'Cart', activeColor: '#FF4D79' },
    { key: 'chat', route: '/(chat)/Conversations', icon: 'chatbubble-ellipses', label: 'Chat', activeColor: '#FF4D79' },
      { key: 'account', route: '/(profile)', icon: 'person', label: 'Account', activeColor: '#FF4D79' },
    ];

    const role = profile?.role;
    const cloned = [...base];

    // 👉 Seller: Add Product
  if (role === 'seller') {
    cloned.splice(2, 0, {
      key: 'addProduct',
      route: '/(seller)',
      icon: 'add',
      activeColor: '#FF4D79',
      isAddAction: true,
    });
  }

  // 👉 Shipper: Orders / Delivery
  if (role === 'shipper') {
    cloned.splice(2, 0, {
      key: 'shipperOrders',
      route: '/(shipper)',
      icon: 'bicycle',
      activeColor: '#4CAF50',
      isAddAction: true,
    });
  }

    return cloned;
  }, [profile?.role]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUnread = async () => {
      try {
        const url = `${API_URL}/chat?user_id=${user.id}&limit=50&offset=0`;
        const response = await fetch(url);
        if (!response.ok) return;
        const data = await response.json();
        const totalUnread = (data || []).reduce((sum, conv) => {
          const count = parseInt(conv.unread_count, 10);
          return sum + (Number.isFinite(count) ? count : 0);
        }, 0);
        setUnreadCount(totalUnread);
      } catch (error) {
        console.warn('Unread fetch failed', error);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleNavPress = (route) => {
    router.push(route);
  };

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = pathname === item.route || pathname.startsWith(item.route);
        const iconColor = isActive ? item.activeColor : '#7A5368';
        const labelColor = isActive ? item.activeColor : '#7A5368';
        const showBadge = item.key === 'chat' && unreadCount > 0;

        if (item.isAddAction) {
          return (
            <TouchableOpacity
              key={item.route}
              style={styles.addButtonWrapper}
              onPress={() => handleNavPress(item.route)}
              accessibilityRole="button"
              accessibilityLabel="Thêm sản phẩm mới"
            >
              <View style={styles.addButton}>
                <Icon name="add" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            onPress={() => handleNavPress(item.route)}
          >
            <View style={{ position: 'relative' }}>
              <Icon name={item.icon} size={22} color={iconColor} />
              {showBadge && (
                <View style={styles.navBadge}>
                  <Text style={styles.navBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount.toString()}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.navLabel, { color: labelColor }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}