import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 160;
const ITEM_WIDTH = (width - 36) / 2; // product card width
const pastelBg = '#FFF6F5'; // light background tone
const accent = '#E5C9C4'; // muted accent
const primary = '#6D4C41'; // darker brown for icons/text

export const styles = StyleSheet.create({
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
  categoryIcon: { width: 36, height: 36, tintColor: primary, resizeMode: 'contain' },
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
  ratingText: { marginLeft: 6, fontWeight: '700', color: primary },
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

// Export constants nếu cần dùng ở nơi khác
export { accent, BANNER_HEIGHT, ITEM_WIDTH, pastelBg, primary, width };
