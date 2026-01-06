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
import { styles as profileStyles } from '../_styles/ProfileStyles';

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
      <View style={[profileStyles.center || styles.center, styles.center]}>
        <Text style={{ color: profileStyles.TEXT || '#2A0E23' }}>Đang tải dữ liệu...</Text>
        <ActivityIndicator size="large" color={profileStyles.PRIMARY || '#FF4D79'} style={styles.loader} />
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
        <Text style={[profileStyles.updateTitle || styles.headerTitle, styles.headerTitle]}>Nạp/Rút Tiền</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Hiển thị số dư hiện tại - Using section style */}
        <View style={[profileStyles.section, styles.balanceCard]}>
          <Text style={[profileStyles.infoLabel, styles.balanceLabel]}>Số dư ví</Text>
          <Text style={[profileStyles.infoValue, styles.balanceValue]}>{formatVND(walletData.balance)}</Text>
        </View>

        {/* Tabs chọn nạp/rút - Adapted from tabRow in profileStyles */}
        <View style={[profileStyles.tabRow, styles.tabContainer]}>
          <TouchableOpacity
            style={[profileStyles.tabItem, styles.tab, selectedAction === 'deposit' && styles.activeTab]}
            onPress={() => setSelectedAction('deposit')}
          >
            <MaterialIcons name="add" size={20} color={selectedAction === 'deposit' ? profileStyles.PRIMARY || '#FF4D79' : profileStyles.TEXT_MUTED || '#7A5368'} />
            <Text style={[profileStyles.tabLabel, styles.tabText, selectedAction === 'deposit' && styles.activeTabText]}>Nạp tiền</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[profileStyles.tabItem, styles.tab, selectedAction === 'withdraw' && styles.activeTab]}
            onPress={() => setSelectedAction('withdraw')}
          >
            <MaterialIcons name="remove" size={20} color={selectedAction === 'withdraw' ? profileStyles.PRIMARY || '#FF4D79' : profileStyles.TEXT_MUTED || '#7A5368'} />
            <Text style={[profileStyles.tabLabel, styles.tabText, selectedAction === 'withdraw' && styles.activeTabText]}>Rút tiền</Text>
          </TouchableOpacity>
        </View>

        {/* Input số tiền - Using input style */}
        <View style={[profileStyles.formGroup, styles.inputContainer]}>
          <Text style={profileStyles.label}>Số tiền</Text>
          <TextInput
            style={[profileStyles.input, styles.amountInput]}
            placeholder={`Nhập số tiền ${selectedAction === 'deposit' ? 'nạp' : 'rút'} (₫)`}
            keyboardType="numeric"
            value={amountInput}
            onChangeText={setAmountInput}
            placeholderTextColor={profileStyles.TEXT_MUTED || '#7A5368'}
          />
        </View>

        {/* Button xác nhận - Using primaryButton */}
        <TouchableOpacity
          style={[
            profileStyles.primaryButton, 
            styles.confirmButton, 
            updateLoading && styles.disabledButton
          ]}
          onPress={() => handleUpdateBalance(parseFloat(amountInput))}
          disabled={updateLoading || !amountInput}
        >
          <Text style={[profileStyles.primaryButtonText, styles.confirmButtonText]}>
            {updateLoading ? 'Đang xử lý...' : `${selectedAction === 'deposit' ? 'Nạp' : 'Rút'} tiền`}
          </Text>
        </TouchableOpacity>

        {updateLoading && <ActivityIndicator size="large" color={profileStyles.PRIMARY || '#FF4D79'} style={styles.loader} />}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: profileStyles.screenPadding || 16,
    alignItems: 'center',
  },
  balanceCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    // Shadow and other from profileStyles.section
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  tabContainer: {
    paddingHorizontal: 6,
    marginBottom: 18,
    width: '100%',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    backgroundColor: profileStyles.PRIMARY || '#FF4D79',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#FFF',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 18,
  },
  amountInput: {
    textAlign: 'center',
    // Border and other from profileStyles.input
  },
  confirmButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    // Background from profileStyles.primaryButton
  },
  disabledButton: {
    backgroundColor: profileStyles.BORDER || '#FFD6E8',
  },
  confirmButtonText: {
    fontSize: 15,
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