import { useUser } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_URL } from '../../../constants/api';
import { styles as profileStyles } from '../_styles/ProfileStyles';

// Hàm format VND (duplicate từ WalletScreen)
const formatVND = (amount) => {
  if (amount == null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Hàm format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN') + ' ' + new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

// Icon và màu cho type - Adapted to theme colors where possible, keep semantic for amounts
const getTransactionIconAndColor = (type, amount) => {
  switch (type) {
    case 'deposit':
      return { icon: 'add-circle', color: '#28A745' }; // Xanh lá
    case 'withdraw':
      return { icon: 'remove-circle', color: '#DC3545' }; // Đỏ
    case 'purchase':
      return { icon: 'shopping-cart', color: '#DC3545' };
    case 'refund':
      return { icon: 'undo', color: '#28A745' };
    case 'adjustment':
      return { icon: 'tune', color: '#FFC107' }; // Vàng
    default:
      return { icon: 'help-outline', color: profileStyles.TEXT_MUTED || '#7A5368' };
  }
};

const TransactionHistoryScreen = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const route = useRoute();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const BASE_URL = API_URL;

  const fetchTransactions = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/wallet_transaction/${user.id}?limit=50`); // Lấy 50 items
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      } else {
        const errorData = await response.json();
        console.error('Error fetching transactions:', errorData);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderTransactionItem = ({ item }) => {
    const { icon, color } = getTransactionIconAndColor(item.type, item.amount);
    const isPositive = item.amount > 0;
    const amountColor = isPositive ? '#28A745' : '#DC3545';

    return (
      <View style={[profileStyles.utilityItem, styles.transactionItem]}>
        <View style={styles.transactionIconContainer}>
          <MaterialIcons name={icon} size={24} color={color} />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={[profileStyles.utilityLabel, styles.transactionType, { color: profileStyles.PRIMARY || '#FF4D79' }]}>
            {item.type.toUpperCase()}
          </Text>
          <Text style={[profileStyles.infoLabel, styles.transactionDescription]}>
            {item.description || 'Giao dịch không mô tả'}
          </Text>
          <Text style={[profileStyles.infoLabel, styles.transactionDate]}>
            {formatDate(item.transaction_date)}
          </Text>
        </View>
        <View style={styles.transactionAmountContainer}>
          <Text style={[profileStyles.infoValue, styles.transactionAmount, { color: amountColor }]}>
            {formatVND(item.amount)}
          </Text>
          <Text style={[profileStyles.infoLabel, styles.transactionStatus, { color: '#28A745' }]}>
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  if (loading && transactions.length === 0) {
    return (
      <View style={[profileStyles.center || styles.center, styles.center]}>
        <ActivityIndicator size="large" color={profileStyles.PRIMARY || '#FF4D79'} />
        <Text style={[profileStyles.infoLabel, styles.loadingText]}>Đang tải lịch sử...</Text>
      </View>
    );
  }

  return (
    <View style={[profileStyles.container, styles.container]}>
      <StatusBar barStyle="dark-content" backgroundColor={profileStyles.CARD || '#FFFFFF'} />
      
      {/* Header - Adapted from profileStyles.header */}
      <View style={[profileStyles.header, styles.header]}>
        <TouchableOpacity style={[profileStyles.backButtonContainer, styles.backButton]} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color={profileStyles.PRIMARY || '#FF4D79'} />
        </TouchableOpacity>
        <Text style={[profileStyles.updateTitle || styles.headerTitle, styles.headerTitle]}>Lịch sử giao dịch</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[styles.listContent, { padding: profileStyles.screenPadding || 16 }]}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[profileStyles.PRIMARY || '#FF4D79']} 
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={[profileStyles.section, styles.emptyContainer]}>
            <MaterialIcons name="history" size={64} color={profileStyles.TEXT_MUTED || '#7A5368'} />
            <Text style={[profileStyles.sectionTitle, styles.emptyTitle]}>Chưa có giao dịch</Text>
            <Text style={{ color: profileStyles.TEXT_MUTED || '#7A5368', ...styles.emptyDesc }}>
              Giao dịch đầu tiên sẽ xuất hiện ở đây!
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Background already handled by profileStyles.container
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: profileStyles.BORDER || '#FFD6E8',
    // Shadow from profileStyles.header
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginRight: -24,
  },
  headerSpacer: {
    width: 24,
  },
  listContent: {
    // Padding handled in contentContainerStyle
  },
  transactionItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: profileStyles.BORDER || '#FFD6E8',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginBottom: 12,
    // Shadow from profileStyles.utilityItem
  },
  transactionIconContainer: {
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 13,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'right',
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    // BorderRadius and other from profileStyles.section
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
  },
});

export default TransactionHistoryScreen;