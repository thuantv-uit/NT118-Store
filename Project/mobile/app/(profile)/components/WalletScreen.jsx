import { useUser } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react'; // Thêm useCallback cho useFocusEffect
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_URL } from '../../../constants/api';

// Hàm format VND (sử dụng Intl.NumberFormat)
const formatVND = (amount) => {
  if (amount == null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0, // VND thường không cần thập phân
  }).format(amount);
};

const WalletScreen = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [walletCreated, setWalletCreated] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const BASE_URL = API_URL;

  const fetchWalletData = async () => {
    if (!user?.id) return;
    setFetchLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/wallets/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setWalletData(data);
        setWalletCreated(true);
      } else {
        const errorData = await response.json();
        Alert.alert('Lỗi', errorData.message || 'Không tìm thấy wallet');
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      Alert.alert('Lỗi', 'Lỗi kết nối khi lấy dữ liệu wallet');
    } finally {
      setFetchLoading(false);
    }
  };

  // Sử dụng useFocusEffect để refresh data khi screen focus (ví dụ sau khi back từ screen khác)
  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [user])
  );

  // Giữ useEffect cho initial load với user
  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWalletData();
    setRefreshing(false);
  };

  const handleCreateWallet = async () => {
    if (walletCreated) {
      Alert.alert('Thông báo', 'Wallet đã được tạo rồi!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: user?.id,
        }),
      });

      if (response.ok) {
        Alert.alert('Thành công', 'Tạo wallet thành công! Đang tải dữ liệu...');
        await fetchWalletData();
      } else {
        const errorData = await response.json();
        Alert.alert('Lỗi', errorData.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Lỗi kết nối server');
      console.error('Error creating wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkBankAccount = () => {
    navigation.navigate('(profile)/components/BankAccountScreen');
  };

  const handleDepositWithdraw = () => {
    if (!walletData) {
      Alert.alert('Thông báo', 'Vui lòng tạo ví trước!');
      return;
    }
    navigation.navigate('(profile)/components/DepositWithdrawScreen', { walletData });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Đang tải user...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header giống Shopee */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#EE4D2D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ví của tôi</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#EE4D2D']} />
        }
      >
        {/* Card tạo ví */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="account-balance-wallet" size={28} color="#EE4D2D" />
            <Text style={styles.cardTitle}>Tạo Ví Mới</Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, (loading || walletCreated) && styles.disabledButton]}
            onPress={handleCreateWallet}
            disabled={loading || walletCreated}
          >
            <Text style={styles.buttonText}>
              {walletCreated ? 'Ví đã tạo!' : 'Tạo Ví'}
            </Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="#EE4D2D" style={styles.loader} />}

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleLinkBankAccount}
          >
            <Text style={styles.secondaryButtonText}>
              Liên kết ngân hàng
            </Text>
          </TouchableOpacity>
        </View>

        {/* Empty state nếu chưa có data */}
        {!walletData && !loading && (
          <View style={styles.emptyCard}>
            <MaterialIcons name="wallet" size={64} color="#CCC" />
            <Text style={styles.emptyTitle}>Chưa có ví</Text>
            <Text style={styles.emptyDesc}>Tạo ví để bắt đầu quản lý tiền nhé!</Text>
          </View>
        )}

        {/* Hiển thị data */}
        {walletData && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="account-balance-wallet" size={28} color="#EE4D2D" />
              <Text style={styles.cardTitle}>Thông tin Ví</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Số dư</Text>
              <Text style={styles.infoValue}>{formatVND(walletData.balance)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Ngày tạo</Text>
              <Text style={styles.infoValue}>{new Date(walletData.created_at).toLocaleDateString('vi-VN')}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cập nhật lần cuối</Text>
              <Text style={styles.infoValue}>{new Date(walletData.updated_at).toLocaleDateString('vi-VN')}</Text>
            </View>

            {/* Button nạp/rút tiền chung */}
            <TouchableOpacity
              style={styles.depositWithdrawButton}
              onPress={handleDepositWithdraw}
            >
              <MaterialIcons name="account-balance" size={20} color="#FFF" />
              <Text style={styles.depositWithdrawButtonText}>Nạp/Rút tiền</Text>
            </TouchableOpacity>

            {fetchLoading && <ActivityIndicator size="small" color="#EE4D2D" />}
          </View>
        )}
      </ScrollView>
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
    marginRight: -24, // Để cân bằng icon
  },
  headerSpacer: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#EE4D2D',
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 56, // Sử dụng minHeight thay vì height fixed
    width: '100%', // Full width để text không bị cắt ngang
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#DDD',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20, // Tăng lineHeight để tránh cắt dọc
    textAlign: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#EE4D2D',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 52, // Sử dụng minHeight thay vì height fixed
    width: '100%', // Full width để text không bị cắt ngang
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#EE4D2D',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20, // Tăng lineHeight để tránh cắt dọc
    textAlign: 'center',
  },
  loader: {
    marginTop: 16,
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
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
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  // Style cho button nạp/rút tiền
  depositWithdrawButton: {
    backgroundColor: '#EE4D2D',
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  depositWithdrawButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WalletScreen;