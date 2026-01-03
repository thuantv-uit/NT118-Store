import { useUser } from '@clerk/clerk-expo';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { API_URL } from '../../../constants/api';
import useCustomerProfile from '../../../utlis/useCustomerProfile';
import { styles } from '../_styles/HomeStyles';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname() || '/(home)';
  const { user } = useUser();
  const { profile } = useCustomerProfile();

  const [unreadCount, setUnreadCount] = useState(0);

  /* -------------------- NAV ITEMS -------------------- */
const navItems = useMemo(() => {
  const role = profile?.role;

  // BUYER (giữ như cũ)
  if (role === 'buyer') {
    return [
      {
        key: 'home',
        route: '/(home)',
        icon: 'home',
        label: 'Home',
        activeColor: '#FF4D79',
      },
      {
        key: 'cart',
        route: '/(buyer)',
        icon: 'cart-outline',
        label: 'Cart',
        activeColor: '#FF4D79',
      },
      {
        key: 'chat',
        route: '/(chat)/Conversations',
        icon: 'chatbubble-ellipses',
        label: 'Chat',
        activeColor: '#FF4D79',
      },
      {
        key: 'account',
        route: '/(profile)',
        icon: 'person',
        label: 'Account',
        activeColor: '#FF4D79',
      },
    ];
  }

  // SELLER → home, list, add, chat, account
  if (role === 'seller') {
    return [
      {
        key: 'home',
        route: '/(home)',
        icon: 'home',
        label: 'Home',
        activeColor: '#FF4D79',
      },
      {
        key: 'list',
        route: '/(seller)/(dashboard)/dashboard',
        icon: 'list',
        label: 'Orders',
        activeColor: '#FF4D79',
      },
      {
        key: 'add',
        route: '/(seller)/components/product-create',
        icon: 'add',
        activeColor: '#FF4D79',
        isAddAction: true, // 🔥 button lớn
      },
      {
        key: 'chat',
        route: '/(chat)/Conversations',
        icon: 'chatbubble-ellipses',
        label: 'Chat',
        activeColor: '#FF4D79',
      },
      {
        key: 'account',
        route: '/(profile)',
        icon: 'person',
        label: 'Account',
        activeColor: '#FF4D79',
      },
    ];
  }

  // SHIPPER → home, bicycle, account
  if (role === 'shipper') {
    return [
      {
        key: 'home',
        route: '/(home)',
        icon: 'home',
        label: 'Home',
        activeColor: '#FF4D79',
      },
      {
        key: 'shipperOrders',
        route: '/(shipper)',
        icon: 'bicycle',
        label: 'Orders',
        activeColor: '#FF4D79',
        isAddAction: true, // 🔥 button giữa
      },
      {
        key: 'account',
        route: '/(profile)',
        icon: 'person',
        label: 'Account',
        activeColor: '#FF4D79',
      },
    ];
  }

  return [];
}, [profile?.role]);


  /* -------------------- NAV HANDLER -------------------- */
const handleNavPress = (route) => {
  router.push(route);
};
  /* -------------------- UNREAD CHAT -------------------- */
  useEffect(() => {
    if (!user?.id) return;

    const fetchUnread = async () => {
      try {
        const response = await fetch(
          `${API_URL}/chat?user_id=${user.id}&limit=50&offset=0`
        );

        if (!response.ok) return;

        const data = await response.json();
        const totalUnread = (data || []).reduce((sum, conv) => {
          const count = parseInt(conv.unread_count, 10);
          return sum + (Number.isFinite(count) ? count : 0);
        }, 0);

        setUnreadCount(totalUnread);
      }  catch (err) {
        console.warn('Unread fetch failed', err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [user?.id]);

  /* -------------------- RENDER -------------------- */
  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive =
          pathname === item.route || pathname.startsWith(item.route);

        const iconColor = isActive ? item.activeColor : '#7A5368';
        const labelColor = isActive ? item.activeColor : '#7A5368';

        const showBadge = item.key === 'chat' && unreadCount > 0;

        // 🔥 Button lớn (Seller / Shipper)
        if (item.isAddAction) {
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.addButtonWrapper}
              onPress={() => handleNavPress(item.route, item.key)}
              accessibilityRole="button"
            >
              <View
                style={[
                  styles.addButton,
                  { backgroundColor: item.activeColor },
                ]}
              >
                <Icon name={item.icon} size={26} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        }

        // 🔹 Tab thường
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => handleNavPress(item.route, item.key)}
          >
            <View style={{ position: 'relative' }}>
              <Icon name={item.icon} size={22} color={iconColor} />

              {showBadge && (
                <View style={styles.navBadge}>
                  <Text style={styles.navBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.navLabel, { color: labelColor }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
