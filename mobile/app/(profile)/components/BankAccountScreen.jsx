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
    <View style={styles.bankItem}>
      <View style={styles.bankHeader}>
        <MaterialIcons name="account-balance" size={20} color="#EE4D2D" />
        <View style={styles.bankInfo}>
          <Text style={styles.bankName}>{item.bank_name}</Text>
          <Text style={styles.cardNumber}>
            **** **** **** {item.card_number.slice(-4)}
          </Text>
        </View>
      </View>
      <View style={styles.bankFooter}>
        <Text style={styles.createdAt}>
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
      <View style={styles.center}>
        <Text>Đang tải user...</Text>
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
        <Text style={styles.headerTitle}>Liên kết ngân hàng</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#EE4D2D']} />
        }
      >
        {/* Card thêm tài khoản */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="add" size={28} color="#EE4D2D" />
            <Text style={styles.cardTitle}>Thêm tài khoản ngân hàng</Text>
          </View>

          {/* Input Bank Name */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <MaterialIcons name="account-balance" size={20} color="#EE4D2D" />
              <Text style={styles.inputLabel}>Tên ngân hàng</Text>
            </View>
            <TextInput
              style={styles.input}
              value={bankName}
              onChangeText={setBankName}
              placeholder="Ví dụ: Vietcombank"
              placeholderTextColor="#999"
            />
          </View>

          {/* Input Card Number */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <MaterialIcons name="credit-card" size={20} color="#EE4D2D" />
              <Text style={styles.inputLabel}>Số thẻ</Text>
            </View>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="Ví dụ: 1234-5678-9012-3456"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          {/* Switch Default */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Đặt làm mặc định</Text>
            <Switch value={isDefault} onValueChange={setIsDefault} trackColor={{ true: '#EE4D2D' }} />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleCreateBankAccount}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Đang tạo...' : 'Liên kết ngân hàng'}
            </Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="#EE4D2D" style={styles.loader} />}
        </View>

        {/* Empty state */}
        {bankAccounts.length === 0 && !loading && (
          <View style={styles.emptyCard}>
            <MaterialIcons name="credit-card" size={64} color="#CCC" />
            <Text style={styles.emptyTitle}>Chưa liên kết ngân hàng</Text>
            <Text style={styles.emptyDesc}>Thêm thẻ để thanh toán nhanh hơn nhé!</Text>
          </View>
        )}

        {/* List bank accounts */}
        {bankAccounts.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="list" size={28} color="#EE4D2D" />
              <Text style={styles.cardTitle}>Tài khoản đã liên kết ({bankAccounts.length})</Text>
            </View>
            <FlatList
              data={bankAccounts}
              renderItem={renderBankAccount}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              style={styles.list}
            />
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
    marginRight: -24,
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
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginLeft: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingVertical: 8,
    paddingLeft: 32, // Để chừa chỗ icon nếu cần, nhưng icon ở header
    fontSize: 16,
    color: '#111',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#EE4D2D',
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
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
  bankItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bankFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createdAt: {
    fontSize: 12,
    color: '#999',
  },
  defaultBadge: {
    backgroundColor: '#EE4D2D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
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