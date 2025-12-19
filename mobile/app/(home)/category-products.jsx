import { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProductsGrid from './components/ProductsGrid';
import { categories } from './_data/homeData';
import { styles, gradientEnd, gradientStart, primary } from './_styles/HomeStyles';

export default function CategoryProductsScreen() {
  const router = useRouter();
  const { categoryId, categoryName } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  
  const category = categories.find(c => c.id === parseInt(categoryId));
  const displayName = categoryName || category?.name || 'Sản phẩm';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: '#fff' }]}>
      <LinearGradient
        colors={[gradientStart, gradientEnd, '#FFF6FB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientBg, { opacity: 0.18 }]}
        pointerEvents="none"
      />
      
      {/* Custom Header */}
      <View style={categoryStyles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={categoryStyles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={categoryStyles.headerTitle}>{displayName}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 20 }} 
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={categoryStyles.loadingContainer}>
            <ActivityIndicator size="large" color={primary} />
            <Text style={categoryStyles.loadingText}>Đang tải sản phẩm...</Text>
          </View>
        ) : (
          <ProductsGrid 
            categoryId={parseInt(categoryId)} 
            searchQuery=""
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const categoryStyles = {
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FF4D79',
    borderBottomWidth: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
};
