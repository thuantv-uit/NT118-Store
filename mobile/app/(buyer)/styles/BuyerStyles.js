import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

const { width } = Dimensions.get('window');

// Styles of the cart
export const buyerStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.light,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: colors.primary.light,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: colors.text.white,
    fontWeight: '600',
  },
  // CartItem styles
  cartItem: {
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 12,
    color: colors.text.light,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent.red,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  removeIcon: {
    fontSize: 20,
    color: colors.accent.red,
  },
  // CartSummary styles
  summary: {
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.secondary.peach,
    padding: 16,
    paddingBottom: 20, // Extra cho safe area
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text.light,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent.red,
  },
  checkoutButton: {
    backgroundColor: colors.primary.light,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.white,
  },
});

// Styles of the checkout
export const checkoutStyles = {
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.icon.inactive,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: colors.background.primary,
    fontSize: 16,
  },
  // option: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 12,
  //   marginBottom: 8,
  //   backgroundColor: 'white',
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: '#BDAAA8',
  // },
  option: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderWidth: 1,
  borderColor: colors.border.light,
  borderRadius: 10,
  marginBottom: 10,
  backgroundColor: colors.background.primary,
  shadowColor: colors.shadow.black,
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
},

optionLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},

optionText: {
  fontSize: 16,
  color: colors.text.primary,
},

selectedOption: {
  backgroundColor: colors.primary.main,
  borderColor: colors.primary.main,
  shadowColor: colors.primary.main,
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
},
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.icon.inactive,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: colors.primary.main,
  },
  itemDetails: {
    alignItems: 'flex-end',
  },
  subtotal: {
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  summary: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.main,
    textAlign: 'right',
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.primary.main,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.light,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyButton: {
    backgroundColor: colors.primary.main,
    padding: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: colors.text.white,
    fontSize: 16,
  },
  paymentOptions: [ // Inline array cho options
    { key: 'card', label: 'Thẻ tín dụng', icon: 'credit-card-outline' },
    { key: 'cash', label: 'Thanh toán khi nhận hàng', icon: 'account-cash-outline' },
    { key: 'bank', label: 'Chuyển khoản ngân hàng', icon: 'bank-outline' },
  ],
};

// Styles of the order
export const orderConfirmStyles = {
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: colors.text.light,
    marginBottom: 4,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.icon.inactive,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: colors.primary.main,
  },
  itemDetails: {
    alignItems: 'flex-end',
  },
  subtotal: {
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  actions: {
    padding: 16,
  },
  button: {
    backgroundColor: colors.primary.main,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.main,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonTextSecondary: {
    color: colors.primary.main,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.light,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyButton: {
    backgroundColor: colors.primary.main,
    padding: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: colors.text.white,
    fontSize: 16,
  },
};