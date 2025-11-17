import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const screenPadding = 16;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F7',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8F7',
    paddingHorizontal: screenPadding,
    paddingVertical: 16,
    marginBottom: 20,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B9D',
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-start',
  },
  followersText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  followSpace: {
    width: 16,
    height: 1,
  },
  followingText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  headerIcons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 8,
    right: 16,
  },
  iconBtn: {
    marginLeft: 12,
    padding: 4,
  },
  // Section common
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: screenPadding,
    marginBottom: 12,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  // Order
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF8F7',
    borderRadius: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  // Utilities
  utilitiesContainer: {
  },
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
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE4E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 4,
  },
  utilityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
  },
  utilityLabel: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  // Expense management
  expenseScroll: {
    paddingHorizontal: 8,
  },
  expenseCard: {
    width: width * 0.8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseTitle: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  expenseValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  expenseTrend: {
    fontSize: 12,
    fontWeight: '500',
  },
  expenseSub: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  // Logout
  logoutBtn: {
    backgroundColor: '#FF6B9D',
    marginHorizontal: screenPadding,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
    color: '#8D6E63',
    marginTop: 2,
  },
    // Update Profile styles – cập nhật khớp hình
  updateContainer: {
    flex: 1,
    backgroundColor: '#FFF8F7',
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
    padding: 8,
  },
  updateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  saveBtnHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveTextHeader: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
  },
  avatarEditContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  avatarEdit: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B9D',
    borderRadius: 20,
    padding: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
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
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  gioiTinhContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  gioiTinhOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gioiTinhLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});