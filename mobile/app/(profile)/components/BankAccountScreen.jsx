import { useUser } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_URL } from '../../../constants/api';
import { styles as profileStyles } from '../_styles/ProfileStyles';

const BankAccountScreen = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [bankName, setBankName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const BASE_URL = API_URL;

  const fetchBankAccounts = async () => {
    if (!user?.id) return;
    setFetchLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/bank_accounts/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setBankAccounts(data);
      } else {
        const errorData = await response.json();
        Alert.alert('Lỗi', errorData.message || 'Không tìm thấy tài khoản ngân hàng');
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      Alert.alert('Lỗi', 'Lỗi kết nối khi lấy dữ liệu');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBankAccounts();
    setRefreshing(false);
  };

  const handleCreateBankAccount = async () => {
    if (!bankName || !cardNumber) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên ngân hàng và số thẻ');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/bank_accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: user?.id,
          bank_name: bankName,
          card_number: cardNumber,
          is_default: isDefault,
        }),
      });

      if (response.ok) {
        Alert.alert('Thành công', 'Tạo tài khoản ngân hàng thành công! Đang tải danh sách...');
        setBankName('');
        setCardNumber('');
        setIsDefault(false);
        await fetchBankAccounts();
      } else {
        const errorData = await response.json();
        Alert.alert('Lỗi', errorData.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Lỗi kết nối server');
      console.error('Error creating bank account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderBankAccount = ({ item }) => (
    <View style={[profileStyles.infoRow, styles.bankItem]}>
      <View style={styles.bankHeader}>
        <MaterialIcons name="account-balance" size={20} color={profileStyles.PRIMARY || '#FF4D79'} />
        <View style={styles.bankInfo}>
          <Text style={[profileStyles.infoValue, styles.bankName]}>{item.bank_name}</Text>
          <Text style={[profileStyles.infoLabel, styles.cardNumber]}>
            **** **** **** {item.card_number.slice(-4)}
          </Text>
        </View>
      </View>
      <View style={styles.bankFooter}>
        <Text style={[profileStyles.infoLabel, styles.createdAt]}>
          Tạo: {new Date(item.created_at).toLocaleDateString('vi-VN')}
        </Text>
        {item.is_default && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Mặc định</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (!user) {
    return (
      <View style={[profileStyles.center || styles.center, styles.center]}>
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
        <Text style={[profileStyles.updateTitle || styles.headerTitle, styles.headerTitle]}>Liên kết ngân hàng</Text>
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
        {/* Card thêm tài khoản - Using section style */}
        <View style={[profileStyles.section, styles.card]}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="add" size={28} color={profileStyles.PRIMARY || '#FF4D79'} />
            <Text style={[profileStyles.sectionTitle, styles.cardTitle]}>Thêm tài khoản ngân hàng</Text>
          </View>

          {/* Input Bank Name - Adapted from profileStyles.input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <MaterialIcons name="account-balance" size={20} color={profileStyles.PRIMARY || '#FF4D79'} />
              <Text style={[profileStyles.label, styles.inputLabel]}>Tên ngân hàng</Text>
            </View>
            <TextInput
              style={[profileStyles.input, styles.input]}
              value={bankName}
              onChangeText={setBankName}
              placeholder="Ví dụ: Vietcombank"
              placeholderTextColor={profileStyles.TEXT_MUTED || '#7A5368'}
            />
          </View>

          {/* Input Card Number - Adapted from profileStyles.input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <MaterialIcons name="credit-card" size={20} color={profileStyles.PRIMARY || '#FF4D79'} />
              <Text style={[profileStyles.label, styles.inputLabel]}>Số thẻ</Text>
            </View>
            <TextInput
              style={[profileStyles.input, styles.input]}
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="Ví dụ: 1234-5678-9012-3456"
              placeholderTextColor={profileStyles.TEXT_MUTED || '#7A5368'}
              keyboardType="numeric"
            />
          </View>

          {/* Switch Default */}
          <View style={styles.switchContainer}>
            <Text style={[profileStyles.label, styles.switchLabel]}>Đặt làm mặc định</Text>
            <Switch 
              value={isDefault} 
              onValueChange={setIsDefault} 
              trackColor={{ true: profileStyles.PRIMARY || '#FF4D79' }} 
              thumbColor="#FFF"
            />
          </View>

          <TouchableOpacity
            style={[
              profileStyles.primaryButton, 
              styles.primaryButton, 
              loading && styles.disabledButton
            ]}
            onPress={handleCreateBankAccount}
            disabled={loading}
          >
            <Text style={[profileStyles.primaryButtonText, styles.buttonText]}>
              {loading ? 'Đang tạo...' : 'Liên kết ngân hàng'}
            </Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color={profileStyles.PRIMARY || '#FF4D79'} style={styles.loader} />}
        </View>

        {/* Empty state - Adapted from section */}
        {bankAccounts.length === 0 && !loading && (
          <View style={[profileStyles.section, styles.emptyCard]}>
            <MaterialIcons name="credit-card" size={64} color={profileStyles.TEXT_MUTED || '#7A5368'} />
            <Text style={[profileStyles.sectionTitle, styles.emptyTitle]}>Chưa liên kết ngân hàng</Text>
            <Text style={{ color: profileStyles.TEXT_MUTED || '#7A5368', ...styles.emptyDesc }}>
              Thêm thẻ để thanh toán nhanh hơn nhé!
            </Text>
          </View>
        )}

        {/* List bank accounts - Using section style */}
        {bankAccounts.length > 0 && (
          <View style={[profileStyles.section, styles.card]}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="list" size={28} color={profileStyles.PRIMARY || '#FF4D79'} />
              <Text style={[profileStyles.sectionTitle, styles.cardTitle]}>
                Tài khoản đã liên kết ({bankAccounts.length})
              </Text>
            </View>
            <FlatList
              data={bankAccounts}
              renderItem={renderBankAccount}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              style={styles.list}
            />
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
    marginBottom: 12,
  },
  cardTitle: {
    marginLeft: 10,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    marginLeft: 10,
    fontWeight: '600',
  },
  input: {
    padding: 12,
    // Border and other from profileStyles.input
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: profileStyles.BORDER || '#FFD6E8',
  },
  switchLabel: {
    fontSize: 14,
  },
  primaryButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
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
  bankItem: {
    paddingVertical: 10,
    // Border from profileStyles.infoRow
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bankInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bankName: {
    fontWeight: '700',
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 13,
    marginTop: 2,
  },
  bankFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createdAt: {
    fontSize: 13,
  },
  defaultBadge: {
    backgroundColor: profileStyles.PRIMARY || '#FF4D79',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    maxHeight: 300,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BankAccountScreen;