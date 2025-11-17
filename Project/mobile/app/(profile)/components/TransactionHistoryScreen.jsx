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

// Icon và màu cho type
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
      return { icon: 'help-outline', color: '#6C757D' };
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
      <View style={styles.transactionItem}>
        <View style={styles.transactionIconContainer}>
          <MaterialIcons name={icon} size={24} color={color} />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionType}>{item.type.toUpperCase()}</Text>
          <Text style={styles.transactionDescription}>{item.description || 'Giao dịch không mô tả'}</Text>
          <Text style={styles.transactionDate}>{formatDate(item.transaction_date)}</Text>
        </View>
        <View style={styles.transactionAmountContainer}>
          <Text style={[styles.transactionAmount, { color: amountColor }]}>
            {formatVND(item.amount)}
          </Text>
          <Text style={styles.transactionStatus}>{item.status}</Text>
        </View>
      </View>
    );
  };

  if (loading && transactions.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#EE4D2D" />
        <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#EE4D2D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#EE4D2D']} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="history" size={64} color="#CCC" />
            <Text style={styles.emptyTitle}>Chưa có giao dịch</Text>
            <Text style={styles.emptyDesc}>Giao dịch đầu tiên sẽ xuất hiện ở đây!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E8E8E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  listContent: {
    padding: 16,
  },
  transactionItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  transactionIconContainer: {
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EE4D2D',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
    color: '#28A745',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#666',
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
    color: '#666',
  },
});

export default TransactionHistoryScreen;