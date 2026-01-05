import { useAuth } from '@clerk/clerk-expo';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

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

  const role = profile?.role;

  /* ===================== ALL UTILITIES ===================== */
  const ALL_UTILITIES = [
    {
      key: 'wishlist',
      icon: 'favorite',
      label: 'Yêu thích',
      route: '/(buyer)/components/WishListScreen',
      roles: ['buyer'],
    },
    {
      key: 'wallet',
      icon: 'account-balance-wallet',
      label: 'Ví',
      route: '/(profile)/components/WalletScreen',
      roles: ['buyer', 'seller'],
    },
    {
      key: 'address',
      icon: 'location-on',
      label: 'Địa chỉ',
      route: '/(profile)/components/DeliveryScreen',
      roles: ['buyer'],
    },
  ];

  /* ===================== FILTER BY ROLE ===================== */
  const utilities = ALL_UTILITIES.filter(
    (item) => item.roles.includes(role)
  );

  /* ===================== FOCUS REFRESH ===================== */
  useFocusEffect(
    useCallback(() => {
      console.log('[ProfileScreen] Focus → refresh profile');
      refreshProfile();
    }, [refreshProfile])
  );

  /* ===================== HANDLERS ===================== */
  const handleEditProfile = () => {
    router.push('/(profile)/components/updateProfile');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('[ProfileScreen] Logout failed:', error);
    }
  };

  const handleUtilityPress = (utility) => {
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

        {/* UTILITIES (ẩn nếu shipper) */}
        {utilities.length > 0 && (
          <UtilitiesSection
            utilities={utilities}
            onPressItem={handleUtilityPress}
          />
        )}

        <ExpensesSection />

        <LogoutButton onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
