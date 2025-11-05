// HomeScreen.js
import { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 160;
const ITEM_WIDTH = (width - 36) / 2; // product card width

// Mock data
const banners = [
  { id: 'b1', image: 'https://cdn.pixabay.com/photo/2017/09/04/18/58/sale-2714470_1280.jpg' },
  { id: 'b2', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200' },
  { id: 'b3', image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1200' },
];

const categories = [
  { id: 'c1', name: 'Áo thun', image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png' },
  { id: 'c2', name: 'Quần', image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png' },
  { id: 'c3', name: 'Váy', image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png' },
  { id: 'c4', name: 'Áo khoác', image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png' },
  { id: 'c5', name: 'Thể thao', image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png' },
  { id: 'c6', name: 'Phụ kiện', image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png' },
  { id: 'c7', name: 'Túi', image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png' },
  { id: 'c8', name: 'Giày', image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png' },
];

const flashSale = [
  { id: 'f1', name: 'Áo Polo', price: 199000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600' },
  { id: 'f2', name: 'Quần Jean', price: 299000, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600' },
  { id: 'f3', name: 'Đầm Nữ', price: 249000, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600' },
  { id: 'f4', name: 'Áo Khoác', price: 399000, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600' },
];

const products = [
  { id: 1, name: 'Đầm Body Maxi Nữ', price: 220000, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800' },
  { id: 2, name: 'Áo Sơ Mi Nữ', price: 350000, image: 'https://images.unsplash.com/photo-1520975916012-5ae5a2b0f5a5?w=800' },
  { id: 3, name: 'Quần Short', price: 150000, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800' },
  { id: 4, name: 'Áo Thun Nam', price: 120000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' },
  { id: 5, name: 'Áo Khoác Denim', price: 420000, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' },
  { id: 6, name: 'Váy Hè', price: 280000, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800' },
];

export default function HomeScreen({ navigation }) {
  const username = 'Thuan';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerRef = useRef(null);

  // Banner pager handler
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setActiveBanner(viewableItems[0].index);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderBanner = ({ item }) => (
    <Image source={{ uri: item.image }} style={styles.bannerImage} />
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIconWrapper}>
        <Image source={{ uri: item.image }} style={styles.categoryIcon} />
      </View>
      <Text style={styles.categoryLabel} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFlash = ({ item }) => (
    <View style={styles.flashCard}>
      <Image source={{ uri: item.image }} style={styles.flashImage} />
      <Text style={styles.flashName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.flashPrice}>{item.price.toLocaleString()}₫</Text>
    </View>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productMeta}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()}₫</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER fixed */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.hello}>Hi, <Text style={styles.username}>{username}</Text></Text>
        </View>

        <View style={styles.headerCenter}>
          <View style={styles.searchBox}>
            <Icon name="search-outline" size={18} color="#BDAAA8" />
            <TextInput
              placeholder="Clothing"
              placeholderTextColor="#BDAAA8"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.headerRight}>
          <Icon name="camera-outline" size={22} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        {/* Banner carousel */}
        <View style={styles.bannerWrapper}>
          <FlatList
            ref={bannerRef}
            data={banners}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderBanner}
            keyExtractor={(i) => i.id}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
          />
          {/* Dots */}
          <View style={styles.dots}>
            {banners.map((b, i) => (
              <View key={b.id} style={[styles.dot, i === activeBanner && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <TouchableOpacity><Text style={styles.sectionMore}>Xem tất cả</Text></TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            numColumns={4}
            renderItem={renderCategory}
            keyExtractor={(i) => i.id}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesGrid}
          />
        </View>

        {/* Flash Sale horizontal */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Flash Sale</Text>
            <Text style={styles.sectionSub}>Giảm sâu trong thời gian có hạn</Text>
          </View>
          <FlatList
            data={flashSale}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderFlash}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ paddingLeft: 12 }}
          />
        </View>

        {/* Promo card (Emty Club) */}
        <View style={styles.promoWrapper}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoTitle}>Emty Club</Text>
            <Text style={styles.promoDesc}>Deal hot mỗi ngày — giảm đến 50%!</Text>
            <View style={styles.promoRow}>
              <View style={styles.rating}>
                <Icon name="star" size={14} color="#FFD54F" />
                <Text style={styles.ratingText}>4.5</Text>
              </View>
              <TouchableOpacity style={styles.shopNow}>
                <Text style={styles.shopNowText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?w=800' }} style={styles.promoImage} />
        </View>

        {/* Products */}
        <View style={[styles.section, { paddingTop: 6 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sản phẩm</Text>
            <TouchableOpacity><Text style={styles.sectionMore}>Xem tất cả</Text></TouchableOpacity>
          </View>

          <FlatList
            data={products}
            numColumns={2}
            renderItem={renderProduct}
            keyExtractor={(i) => i.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>
      </ScrollView>

      {/* Bottom navigation (fixed) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={22} color="#FF8A65" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="grid" size={22} color="#8D6E63" />
          <Text style={styles.navLabel}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="chatbubble-ellipses" size={22} color="#8D6E63" />
          <Text style={styles.navLabel}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person" size={22} color="#8D6E63" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const pastelBg = '#FFF6F5'; // light background tone
const accent = '#E5C9C4'; // muted accent
const primary = '#6D4C41'; // darker brown for icons/text

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: pastelBg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFF2EF',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    elevation: 2,
  },
  headerLeft: { flex: 1 },
  hello: { fontSize: 16, color: primary, opacity: 0.9 },
  username: { fontWeight: '700', color: primary },

  headerCenter: { flex: 2, paddingHorizontal: 8 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 38,
    borderWidth: 0.5,
    borderColor: '#E8D7D4',
  },
  searchInput: { flex: 1, marginLeft: 8, color: '#6B4F47', fontSize: 14 },

  headerRight: { flex: 0.5, alignItems: 'flex-end' },

  bannerWrapper: {
    marginTop: 12,
    alignItems: 'center',
  },
  bannerImage: {
    width: width - 24,
    height: BANNER_HEIGHT,
    borderRadius: 12,
    marginHorizontal: 12,
    resizeMode: 'cover',
  },
  dots: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#E8D7D4',
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: '#CFAAA3' },

  section: {
    marginTop: 14,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#5B453F' },
  sectionMore: { color: '#A78A83', fontSize: 13 },
  sectionSub: { color: '#A78A83', fontSize: 12 },

  categoriesGrid: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  categoryItem: {
    width: (width - 40) / 4,
    alignItems: 'center',
    marginVertical: 6,
  },
  categoryIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FFF0EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: { width: 36, height: 36, tintColor: '#6D4C41', resizeMode: 'contain' },
  categoryLabel: { marginTop: 6, fontSize: 12, color: primary, textAlign: 'center' },

  flashCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    elevation: 2,
  },
  flashImage: { width: '100%', height: 70, borderRadius: 8, resizeMode: 'cover' },
  flashName: { marginTop: 6, fontSize: 13, color: '#4E3B36' },
  flashPrice: { marginTop: 4, color: '#E64A19', fontWeight: '700' },

  promoWrapper: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    elevation: 2,
    alignItems: 'center',
  },
  promoLeft: { flex: 1 },
  promoTitle: { fontSize: 16, fontWeight: '700', color: '#5B3F3A' },
  promoDesc: { fontSize: 13, color: '#8E6D67', marginTop: 4 },
  promoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  rating: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  ratingText: { marginLeft: 6, fontWeight: '700', color: '#6D4C41' },
  shopNow: {
    backgroundColor: '#F6E8E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  shopNowText: { color: '#5B3F3A', fontWeight: '700' },
  promoImage: { width: 90, height: 90, borderRadius: 10, marginLeft: 8, resizeMode: 'cover' },

  productsGrid: {
    paddingTop: 6,
    paddingBottom: 30,
  },
  productCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 6,
    overflow: 'hidden',
    elevation: 2,
  },
  productImage: { width: '100%', height: ITEM_WIDTH, resizeMode: 'cover' },
  productMeta: { padding: 8 },
  productName: { fontSize: 14, color: '#3f2d2a' },
  productPrice: { marginTop: 6, fontSize: 14, fontWeight: '700', color: '#E64A19' },

  bottomNav: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 6,
    paddingHorizontal: 10,
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 11, color: '#8D6E63', marginTop: 2 },
});
