import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const screenPadding = 16;

const PRIMARY = '#FF4D79';
const PRIMARY_DARK = '#C2185B';
const PRIMARY_LIGHT = '#FFE6F0';
const GRADIENT_START = '#FF7BAC';
const GRADIENT_END = '#FF4D79';
const TEXT = '#2A0E23';
const TEXT_MUTED = '#7A5368';
const BG = '#FFF6FB';
const CARD = '#FFFFFF';
const BORDER = '#FFD6E8';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: BG,
    paddingHorizontal: screenPadding,
    paddingVertical: 16,
    marginBottom: 8,
    position: 'relative',
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY_LIGHT,
    borderWidth: 2,
    borderColor: BORDER,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 4,
  },
  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-start',
  },
  followersText: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  followSpace: {
    width: 12,
    height: 1,
  },
  followingText: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 12,
    right: 16,
  },
  iconBtn: {
    marginLeft: 12,
    padding: 6,
    backgroundColor: CARD,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  backButtonContainer: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: CARD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginRight: 8,
  },
  // Section common
  section: {
    backgroundColor: CARD,
    marginHorizontal: screenPadding,
    marginBottom: 14,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#FFB3CD',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 12,
  },
  // Order
  tabRow: {
    flexDirection: 'row',
    backgroundColor: PRIMARY_LIGHT,
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    color: TEXT,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Utilities
  utilitiesContainer: {},
  utilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  utilityItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#FFB3CD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 4,
  },
  utilityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: PRIMARY_LIGHT,
  },
  utilityLabel: {
    fontSize: 13,
    color: TEXT,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Expense management
  expenseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  expenseCard: {
    width: '48%',
    padding: 16,
    borderRadius: 14,
    alignItems: 'flex-start',
    shadowColor: '#FFB3CD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  expenseTitle: {
    marginLeft: 10,
    fontSize: 13,
    color: TEXT_MUTED,
    flex: 1,
    fontWeight: '600',
  },
  expenseValue: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 6,
  },
  expenseTrend: {
    fontSize: 13,
    fontWeight: '700',
  },
  expenseSub: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 6,
  },
  // Logout
  logoutBtn: {
    backgroundColor: PRIMARY,
    marginHorizontal: screenPadding,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FFB3CD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: CARD,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 10,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  // Update Profile styles
  updateContainer: {
    flex: 1,
    backgroundColor: BG,
  },
  updateScroll: {
    padding: 16,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    padding: 10,
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  updateTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT,
  },
  saveBtnHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: PRIMARY,
    borderRadius: 12,
  },
  saveTextHeader: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  avatarEditContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    width: 110,
    alignSelf: 'center',
  },
  avatarEdit: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    backgroundColor: PRIMARY,
    borderRadius: 24,
    padding: 10,
    shadowColor: '#FFB3CD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 8,
    fontWeight: '600',
  },
  rowInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    flex: 0.48,
    width: undefined,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: CARD,
    color: TEXT,
  },
  avatarUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  avatarUploadText: {
    color: TEXT,
    fontWeight: '700',
  },
  avatarPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  removeAvatarButton: {
    marginLeft: 10,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: screenPadding,
    marginBottom: 16,
    shadowColor: '#FFB3CD',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 5,
  },
  infoGradient: {
    padding: 1,
    borderRadius: 16,
  },
  infoContent: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 16,
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT,
  },
  infoSubtitle: {
    marginTop: 4,
    color: TEXT_MUTED,
    fontSize: 13,
  },
  infoBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: PRIMARY_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    color: PRIMARY_DARK,
    fontWeight: '700',
  },
  infoRows: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  infoLabel: {
    flex: 1,
    color: TEXT_MUTED,
    fontSize: 13,
  },
  infoValue: {
    flex: 2,
    color: TEXT,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    marginTop: 10,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 15,
  },
});
