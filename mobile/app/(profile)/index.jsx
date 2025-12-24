import { useAuth } from '@clerk/clerk-expo';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, SafeAreaView, ScrollView } from 'react-native';

import useCustomerProfile from '../../utlis/useCustomerProfile';
import ExpensesSection from './components/ExpensesSection';
import Header from './components/Header';
import LogoutButton from './components/LogoutButton';
import OrdersSection from './components/OrdersSection';
import ProfileInfoCard from './components/ProfileInfoCard';
import UtilitiesSection from './components/UtilitiesSection';

import { styles } from './_styles/ProfileStyles';

const ProfileScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  /* ===================== PROFILE HOOK ===================== */
  const {
    profile,
    user,
    loading,
    refreshProfile,
    isProfileComplete,
  } = useCustomerProfile();

  /* ===================== UTILITIES ===================== */
  const utilities = [
    {
      key: 'wishlist',
      icon: 'favorite',
      label: 'Yêu thích',
      route: '/(buyer)/components/WishListScreen',
    },
    {
      key: 'wallet',
      icon: 'account-balance-wallet',
      label: 'Ví',
      route: '/(profile)/components/WalletScreen',
    },
  ];

  /* ===================== FOCUS REFRESH ===================== */
  useFocusEffect(
    useCallback(() => {
      console.log('[ProfileScreen] Screen focused → refresh profile');
      refreshProfile();
    }, [refreshProfile])
  );

  /* ===================== HANDLERS ===================== */

  const handleEditProfile = () => {
    console.log('[ProfileScreen] Edit profile');
    router.push('/(profile)/components/updateProfile');
  };

  const handleLogout = async () => {
    console.log('[ProfileScreen] Logout');
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('[ProfileScreen] Logout failed:', error);
    }
  };

  /**
   * 🔐 Role-based Utilities handler
   * Kiểm tra quyền truy cập dựa trên role của user trước khi navigate.
   * Sử dụng accessRules để dễ mở rộng khi thêm utility mới.
   */
  const handleUtilityPress = (utility) => {
    const role = profile?.role;

    // Map quyền truy cập cho từng utility (dễ mở rộng)
    const accessRules = {
      wishlist: ['buyer'],  // Chỉ buyer
      wallet: ['buyer', 'seller'],  // Buyer hoặc seller
      // Thêm utility mới ở đây, ví dụ: 'orders': ['buyer', 'seller', 'admin']
    };

    const allowedRoles = accessRules[utility.key] || [];  // Mặc định: không cho phép nếu không định nghĩa
    const hasAccess = allowedRoles.includes(role);

    if (!hasAccess) {
      Alert.alert(
        'Không có quyền truy cập',
        `Tính năng "${utility.label}" chỉ dành cho ${allowedRoles.join(' hoặc ')}.\nRole hiện tại: ${role}`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Navigate nếu có quyền
    console.log(`[ProfileScreen] Navigating to ${utility.key} for role: ${role}`);  // Log nhẹ để track
    router.push(utility.route);
  };

  /* ===================== RENDER ===================== */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          profile={profile}
          loadingProfile={loading}
          onEdit={handleEditProfile}
        />

        <ProfileInfoCard
          profile={profile}
          clerkUser={user}
          loading={loading}
          onEdit={handleEditProfile}
          onRefresh={refreshProfile}
          isComplete={isProfileComplete}
        />

        <OrdersSection />

        <UtilitiesSection
          utilities={utilities}
          onPressItem={handleUtilityPress}
        />

        <ExpensesSection />

        <LogoutButton onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;