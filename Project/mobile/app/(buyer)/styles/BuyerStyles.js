import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

// Styles of the cart
export const buyerStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF6F5', // Nền ấm áp
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
    color: '#5B453F',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#8D6E63',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#FF8A65',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  // CartItem styles
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
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
    color: '#5B453F',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 12,
    color: '#8D6E63',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E64A19',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF8A65',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B453F',
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  removeIcon: {
    fontSize: 20,
    color: '#E64A19',
  },
  // CartSummary styles
  summary: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5C9C4',
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
    color: '#8D6E63',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E64A19',
  },
  checkoutButton: {
    backgroundColor: '#FF8A65',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});

// Styles of the checkout
export const checkoutStyles = {
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6D4C41',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDAAA8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white',
    fontSize: 16,
  },
  option: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 10,
  marginBottom: 10,
  backgroundColor: '#fff',
  shadowColor: '#000',
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
  color: '#333',
},

selectedOption: {
  backgroundColor: '#6D4C41',
  borderColor: '#6D4C41',
  shadowColor: '#6D4C41',
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
},
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#BDAAA8',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: '#6D4C41',
  },
  itemDetails: {
    alignItems: 'flex-end',
  },
  subtotal: {
    fontWeight: 'bold',
    color: '#6D4C41',
  },
  summary: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6D4C41',
    textAlign: 'right',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#6D4C41',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
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
    color: '#8D6E63',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyButton: {
    backgroundColor: '#6D4C41',
    padding: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
  },
  paymentOptions: [ // Inline array cho options
    { key: 'wallet', label: 'Thanh toán bằng ví', icon: 'wallet-bifold' },
    { key: 'cash', label: 'Thanh toán khi nhận hàng', icon: 'account-cash-outline' },
  ],
};

// Styles of the order
export const orderConfirmStyles = {
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6D4C41',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#8D6E63',
    marginBottom: 4,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#BDAAA8',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: '#6D4C41',
  },
  itemDetails: {
    alignItems: 'flex-end',
  },
  subtotal: {
    fontWeight: 'bold',
    color: '#6D4C41',
  },
  actions: {
    padding: 16,
  },
  button: {
    backgroundColor: '#6D4C41',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6D4C41',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonTextSecondary: {
    color: '#6D4C41',
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
    color: '#8D6E63',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyButton: {
    backgroundColor: '#6D4C41',
    padding: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
  },
};