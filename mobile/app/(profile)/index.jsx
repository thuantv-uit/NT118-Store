import { useAuth } from '@clerk/clerk-expo';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import ExpensesSection from './components/ExpensesSection';
import Header from './components/Header';
import LogoutButton from './components/LogoutButton';
import ProfileInfoCard from './components/ProfileInfoCard';
import OrdersSection from './components/OrdersSection';
import UtilitiesSection from './components/UtilitiesSection';
import { styles } from './_styles/ProfileStyles';
import useCustomerProfile from '../../utlis/useCustomerProfile';

const ProfileScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const {
    profile,
    user,
    loading,
    refreshProfile,
    isProfileComplete,
  } = useCustomerProfile();

  const utilities = [
    { icon: 'favorite', label: 'Yêu thích', route: '/(buyer)/components/WishListScreen' },
    { icon: 'account-balance-wallet', label: 'Ví', route: '/(profile)/components/WalletScreen' },
  ];

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [refreshProfile])
  );

  const handleEditProfile = () => {
    router.push('/(profile)/components/updateProfile');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header profile={profile} loadingProfile={loading} onEdit={handleEditProfile} />
        <ProfileInfoCard
          profile={profile}
          clerkUser={user}
          loading={loading}
          onEdit={handleEditProfile}
          onRefresh={refreshProfile}
          isComplete={isProfileComplete}
        />
        <OrdersSection />
        <UtilitiesSection utilities={utilities} />
        <ExpensesSection />
        <LogoutButton onPress={handleLogout} />
      </ScrollView>
      {/* <BottomNav /> */}
    </SafeAreaView>
  );
};

export default ProfileScreen;
