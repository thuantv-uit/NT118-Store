import { useUser } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { API_URL } from '../../../constants/api';

// Hàm format VND
const formatVND = (amount) => {
  if (amount == null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

const DepositWithdrawScreen = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const route = useRoute();
  const [walletData, setWalletData] = useState(null);
  const [selectedAction, setSelectedAction] = useState('deposit'); // 'deposit' hoặc 'withdraw'
  const [amountInput, setAmountInput] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const BASE_URL = API_URL;

  useEffect(() => {
    // Lấy walletData từ route params
    if (route.params?.walletData) {
      setWalletData(route.params.walletData);
    }
  }, [route.params]);

  const handleUpdateBalance = async (amount) => {
    if (!amount || amount <= 0) {
      Alert.alert('Lỗi', 'Số tiền phải lớn hơn 0');
      return;
    }

    if (selectedAction === 'withdraw' && amount > walletData.balance) {
      Alert.alert('Lỗi', 'Số tiền rút vượt quá số dư hiện tại');
      return;
    }

    setUpdateLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/wallets/${walletData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: user?.id,
          amount: selectedAction === 'deposit' ? amount : -amount,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        Alert.alert(
          'Thành công', 
          `${selectedAction === 'deposit' ? 'Nạp' : 'Rút'} ${formatVND(amount)} thành công!`,
          [
            {
              text: 'OK',
              onPress: () => {
                setAmountInput('');
                navigation.goBack(); // Back về WalletScreen, useFocusEffect sẽ refresh
              },
            },
          ]
        );
        setWalletData(updatedData); // Update local state nếu cần
      } else {
        const errorData = await response.json();
        Alert.alert('Lỗi', errorData.message || `Có lỗi xảy ra khi ${selectedAction === 'deposit' ? 'nạp' : 'rút'} tiền`);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Lỗi kết nối server');
      console.error(`Error ${selectedAction}:`, error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (!user || !walletData) {
    return (
      <View style={styles.center}>
        <Text>Đang tải dữ liệu...</Text>
        <ActivityIndicator size="large" color="#EE4D2D" style={styles.loader} />
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
        <Text style={styles.headerTitle}>Nạp/Rút Tiền</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Hiển thị số dư hiện tại */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Số dư ví</Text>
          <Text style={styles.balanceValue}>{formatVND(walletData.balance)}</Text>
        </View>

        {/* Tabs chọn nạp/rút */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedAction === 'deposit' && styles.activeTab]}
            onPress={() => setSelectedAction('deposit')}
          >
            <MaterialIcons name="add" size={20} color={selectedAction === 'deposit' ? '#EE4D2D' : '#666'} />
            <Text style={[styles.tabText, selectedAction === 'deposit' && styles.activeTabText]}>Nạp tiền</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedAction === 'withdraw' && styles.activeTab]}
            onPress={() => setSelectedAction('withdraw')}
          >
            <MaterialIcons name="remove" size={20} color={selectedAction === 'withdraw' ? '#EE4D2D' : '#666'} />
            <Text style={[styles.tabText, selectedAction === 'withdraw' && styles.activeTabText]}>Rút tiền</Text>
          </TouchableOpacity>
        </View>

        {/* Input số tiền */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.amountInput}
            placeholder={`Nhập số tiền ${selectedAction === 'deposit' ? 'nạp' : 'rút'} (₫)`}
            keyboardType="numeric"
            value={amountInput}
            onChangeText={setAmountInput}
          />
        </View>

        {/* Button xác nhận */}
        <TouchableOpacity
          style={[styles.confirmButton, updateLoading && styles.disabledButton]}
          onPress={() => handleUpdateBalance(parseFloat(amountInput))}
          disabled={updateLoading || !amountInput}
        >
          <Text style={styles.confirmButtonText}>
            {updateLoading ? 'Đang xử lý...' : `${selectedAction === 'deposit' ? 'Nạp' : 'Rút'} tiền`}
          </Text>
        </TouchableOpacity>

        {updateLoading && <ActivityIndicator size="large" color="#EE4D2D" style={styles.loader} />}
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
  },
  headerSpacer: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    width: '100%',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 4,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: '100%',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#EE4D2D',
    borderRadius: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#FFF',
  },
  confirmButton: {
    backgroundColor: '#EE4D2D',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#DDD',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loader: {
    marginTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DepositWithdrawScreen;
