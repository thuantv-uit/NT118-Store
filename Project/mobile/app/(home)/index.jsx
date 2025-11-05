import { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import BannerCarousel from './components/BannerCarousel';
import BottomNav from './components/BottomNav';
import Categories from './components/Categories';
import FlashSale from './components/FlashSale';
import Header from './components/Header';
import ProductsGrid from './components/ProductsGrid';
import PromoCard from './components/PromoCard';
import { styles } from './styles/HomeStyles';

export default function HomeScreen({ navigation }) {
  const username = 'Thuan';
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <Header 
        username={username} 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        <BannerCarousel />
        <Categories />
        <FlashSale />
        <PromoCard />
        <ProductsGrid />
      </ScrollView>

      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}