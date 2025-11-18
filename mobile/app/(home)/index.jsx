import { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import axios from 'axios';
import BannerCarousel from './components/BannerCarousel';
import BottomNav from './components/BottomNav';
import Categories from './components/Categories';
import FlashSale from './components/FlashSale';
import Header from './components/Header';
import ProductsGrid from './components/ProductsGrid';
import PromoCard from './components/PromoCard';
import { styles } from './styles/HomeStyles';
import { API_URL } from '../../constants/api';

export default function HomeScreen({ navigation }) {
  const { userId } = useAuth();
  const [username, setUsername] = useState('User');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers/${userId}`);
      if (response.data && response.data.last_name) {
        setUsername(response.data.last_name);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUsername('User'); // Fallback
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header 
        username={username || 'User'} 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 90 }} 
        showsVerticalScrollIndicator={false}
      >
        <BannerCarousel />
        <Categories />
        <FlashSale />
        <PromoCard />
        <ProductsGrid />
      </ScrollView>

      {/* Truyền navigation cho BottomNav nếu cần, nhưng code BottomNav dùng expo-router nên có thể bỏ */}
      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}