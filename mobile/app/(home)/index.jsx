import { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { styles } from './_styles/HomeStyles';
import BannerCarousel from './components/BannerCarousel';
import BottomNav from './components/BottomNav';
import Categories from './components/Categories';
import FlashSale from './components/FlashSale';
import Header from './components/Header';
import ProductsGrid from './components/ProductsGrid';
import PromoCard from './components/PromoCard';
import ChatbotFloatingButton from './components/ChatbotFloatingButton';

export default function HomeScreen({ navigation }) {
  const username = 'Thuan';
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        username={username || 'User'}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }} // Tăng lên 120 để tránh che nội dung
        showsVerticalScrollIndicator={false}
      >
        <BannerCarousel />
        <Categories />
        <FlashSale />
        <PromoCard />
        <ProductsGrid />
        {/* Không đặt button ở đây nữa */}
      </ScrollView>
      
      <BottomNav navigation={navigation} />
      
      {/* Floating button ở đây để cố định vị trí */}
      <ChatbotFloatingButton />
    </SafeAreaView>
  );
}