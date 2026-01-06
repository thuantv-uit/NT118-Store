import { useUser } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
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
import { styles as profileStyles } from '../_styles/ProfileStyles';

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

        setWalletData(data);              // data có thể là null
        setWalletCreated(!!data);         // ✅ chỉ true nếu có wallet
      } else {
        Alert.alert('Lỗi', 'Không thể lấy dữ liệu ví');
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

  const handleTransactionHistory = () => {
    if (!walletData) {
      Alert.alert('Thông báo', 'Vui lòng tạo ví trước!');
      return;
    }
    navigation.navigate('(profile)/components/TransactionHistoryScreen', { customerId: user.id });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (!user) {
    return (
      <View style={profileStyles.center || styles.center}>
        <Text style={{ color: profileStyles.TEXT || '#2A0E23' }}>Đang tải user...</Text>
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
        <Text style={[profileStyles.updateTitle || styles.headerTitle, styles.headerTitle]}>Ví của tôi</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[profileStyles.PRIMARY || '#FF4D79']} 
          />
        }
      >
        {/* Card tạo ví - Using section style */}
        <View style={[profileStyles.section, styles.card]}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="account-balance-wallet" size={28} color={profileStyles.PRIMARY || '#FF4D79'} />
            <Text style={[profileStyles.sectionTitle, styles.cardTitle]}>Tạo Ví Mới</Text>
          </View>

          <TouchableOpacity
            style={[
              profileStyles.primaryButton, 
              styles.primaryButton, 
              (loading || walletCreated) && styles.disabledButton
            ]}
            onPress={handleCreateWallet}
            disabled={loading || walletCreated}
          >
            <Text style={[profileStyles.primaryButtonText, styles.buttonText]}>
              {walletCreated ? 'Ví đã tạo!' : 'Tạo Ví'}
            </Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color={profileStyles.PRIMARY || '#FF4D79'} style={styles.loader} />}

          <TouchableOpacity 
            style={[
              profileStyles.secondaryButton, 
              styles.secondaryButton
            ]} 
            onPress={handleLinkBankAccount}
          >
            <Text style={[profileStyles.secondaryButtonText, styles.secondaryButtonText]}>
              Liên kết ngân hàng
            </Text>
          </TouchableOpacity>
        </View>

        {/* Empty state nếu chưa có data - Adapted from section */}
        {!walletData && !loading && (
          <View style={[profileStyles.section, styles.emptyCard]}>
            <MaterialIcons name="wallet" size={64} color={profileStyles.TEXT_MUTED || '#7A5368'} />
            <Text style={[profileStyles.sectionTitle, styles.emptyTitle]}>Chưa có ví</Text>
            <Text style={{ color: profileStyles.TEXT_MUTED || '#7A5368', ...styles.emptyDesc }}>
              Tạo ví để bắt đầu quản lý tiền nhé!
            </Text>
          </View>
        )}

        {/* Hiển thị data - Using section style */}
        {walletData && (
          <View style={[profileStyles.section, styles.card]}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="account-balance-wallet" size={28} color={profileStyles.PRIMARY || '#FF4D79'} />
              <Text style={[profileStyles.sectionTitle, styles.cardTitle]}>Thông tin Ví</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: profileStyles.TEXT_MUTED || '#7A5368' }]}>
                Số dư
              </Text>
              <Text style={[styles.infoValue, { color: profileStyles.TEXT || '#2A0E23' }]}>
                {formatVND(walletData.balance)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: profileStyles.TEXT_MUTED || '#7A5368' }]}>
                Ngày tạo
              </Text>
              <Text style={[styles.infoValue, { color: profileStyles.TEXT || '#2A0E23' }]}>
                {new Date(walletData.created_at).toLocaleDateString('vi-VN')}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: profileStyles.TEXT_MUTED || '#7A5368' }]}>
                Cập nhật lần cuối
              </Text>
              <Text style={[styles.infoValue, { color: profileStyles.TEXT || '#2A0E23' }]}>
                {new Date(walletData.updated_at).toLocaleDateString('vi-VN')}
              </Text>
            </View>

            {/* Button nạp/rút tiền - Using primaryButton */}
            <TouchableOpacity
              style={[
                profileStyles.primaryButton, 
                styles.depositWithdrawButton
              ]}
              onPress={handleDepositWithdraw}
            >
              <MaterialIcons name="account-balance" size={20} color="#FFF" />
              <Text style={[profileStyles.primaryButtonText, styles.depositWithdrawButtonText]}>
                Nạp/Rút tiền
              </Text>
            </TouchableOpacity>

            {/* Button lịch sử giao dịch - Using secondaryButton variant */}
            <TouchableOpacity
              style={[
                profileStyles.secondaryButton, 
                { 
                  backgroundColor: profileStyles.TEXT_MUTED || '#7A5368',
                  borderColor: profileStyles.TEXT_MUTED || '#7A5368',
                  marginTop: 12,
                  ...styles.historyButton
                }
              ]}
              onPress={handleTransactionHistory}
            >
              <MaterialIcons name="history" size={20} color="#FFF" />
              <Text style={[profileStyles.primaryButtonText, styles.historyButtonText]}>
                Lịch sử giao dịch
              </Text>
            </TouchableOpacity>

            {fetchLoading && <ActivityIndicator size="small" color={profileStyles.PRIMARY || '#FF4D79'} />}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Background already handled by profileStyles.container
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: profileStyles.BORDER || '#FFD6E8',
    // Shadow from profileStyles.header
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
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
    padding: profileStyles.screenPadding || 16,
  },
  card: {
    padding: 16,
    marginBottom: 14,
    borderRadius: 14,
    borderWidth: 1,
    // Shadow and other from profileStyles.section
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginLeft: 12,
  },
  primaryButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 56,
    width: '100%',
    justifyContent: 'center',
    // Background and other from profileStyles.primaryButton
  },
  disabledButton: {
    backgroundColor: profileStyles.BORDER || '#FFD6E8',
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 52,
    width: '100%',
    justifyContent: 'center',
    // Border and other from profileStyles.secondaryButton
  },
  secondaryButtonText: {
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  loader: {
    marginTop: 16,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
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
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: profileStyles.BORDER || '#FFD6E8',
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 15,
    textAlign: 'right',
  },
  // Style cho button nạp/rút tiền
  depositWithdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  depositWithdrawButtonText: {
    fontSize: 15,
  },
  // Style cho button lịch sử giao dịch
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 12,
  },
  historyButtonText: {
    fontSize: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WalletScreen;