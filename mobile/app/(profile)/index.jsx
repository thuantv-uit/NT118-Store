import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView } from 'react-native';
import BottomNav from './components/BottomNav';
import ExpensesSection from './components/ExpensesSection';
import Header from './components/Header';
import LogoutButton from './components/LogoutButton';
import OrdersSection from './components/OrdersSection';
import UtilitiesSection from './components/UtilitiesSection';
import { mockExpenses, mockOrdersTabs, mockUser, mockUtilities } from './data/mockData';
import { styles } from './styles/ProfileStyles';

const ProfileScreen = () => {
  const router = useRouter();

  const handleTabPress = (label) => {
    console.log(`Navigate to ${label}`);
  };

  const handleLogout = () => {
    // Logic đăng xuất (clear storage, navigate to login)
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header user={mockUser} />
        <OrdersSection tabs={mockOrdersTabs} onTabPress={handleTabPress} />
        <UtilitiesSection utilities={mockUtilities} />
        <ExpensesSection expenses={mockExpenses} />
        <LogoutButton onPress={handleLogout} />
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
};

export default ProfileScreen;