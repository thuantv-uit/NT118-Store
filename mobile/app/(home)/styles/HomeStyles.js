import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 160;
const ITEM_WIDTH = (width - 36) / 2; // product card width

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background.secondary },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.background.secondary,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    elevation: 2,
  },
  headerLeft: { flex: 1 },
  hello: { fontSize: 16, color: colors.text.secondary, opacity: 0.9 },
  username: { fontWeight: '700', color: colors.text.secondary },

  headerCenter: { flex: 2, paddingHorizontal: 8 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 38,
    borderWidth: 0.5,
    borderColor: colors.border.light,
  },
  searchInput: { flex: 1, marginLeft: 8, color: colors.text.tertiary, fontSize: 14 },

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
    backgroundColor: colors.border.light,
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: colors.primary.light },

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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text.secondary },
  sectionMore: { color: colors.text.light, fontSize: 13 },
  sectionSub: { color: colors.text.light, fontSize: 12 },

  categoriesGrid: {
    backgroundColor: colors.background.primary,
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
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: { width: 36, height: 36, tintColor: colors.text.secondary, resizeMode: 'contain' },
  categoryLabel: { marginTop: 6, fontSize: 12, color: colors.text.secondary, textAlign: 'center' },

  flashCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: colors.background.primary,
    borderRadius: 10,
    padding: 8,
    elevation: 2,
  },
  flashImage: { width: '100%', height: 70, borderRadius: 8, resizeMode: 'cover' },
  flashName: { marginTop: 6, fontSize: 13, color: colors.text.tertiary },
  flashPrice: { marginTop: 4, color: colors.accent.red, fontWeight: '700' },

  promoWrapper: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    elevation: 2,
    alignItems: 'center',
  },
  promoLeft: { flex: 1 },
  promoTitle: { fontSize: 16, fontWeight: '700', color: colors.text.secondary },
  promoDesc: { fontSize: 13, color: colors.text.light, marginTop: 4 },
  promoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  rating: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  ratingText: { marginLeft: 6, fontWeight: '700', color: colors.text.secondary },
  shopNow: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  shopNowText: { color: colors.text.secondary, fontWeight: '700' },
  promoImage: { width: 90, height: 90, borderRadius: 10, marginLeft: 8, resizeMode: 'cover' },

  productsGrid: {
    paddingTop: 6,
    paddingBottom: 30,
  },
  productCard: {
    width: ITEM_WIDTH,
    backgroundColor: colors.background.primary,
    borderRadius: 10,
    margin: 6,
    overflow: 'hidden',
    elevation: 2,
  },
  productImage: { width: '100%', height: ITEM_WIDTH, resizeMode: 'cover' },
  productMeta: { padding: 8 },
  productName: { fontSize: 14, color: colors.text.tertiary },
  productPrice: { marginTop: 6, fontSize: 14, fontWeight: '700', color: colors.accent.red },

  bottomNav: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    height: 56,
    backgroundColor: colors.background.primary,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 6,
    paddingHorizontal: 10,
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 11, color: colors.text.light, marginTop: 2 },
});

// Export constants nếu cần dùng ở nơi khác
export { BANNER_HEIGHT, ITEM_WIDTH, width };
