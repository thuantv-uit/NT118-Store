import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../constants/api';
import { styles } from '../_styles/ProfileStyles';

const { width } = Dimensions.get('window');

const ExpensesSection = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = API_URL;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // Kiểm tra nếu user chưa load hoặc chưa sign in
        if (!isLoaded || !isSignedIn || !user) {
          console.warn('User not loaded or not signed in');
          setLoading(false);
          return;
        }

        // Lấy buyerId từ publicMetadata của user (adjust key nếu khác, ví dụ: user.id nếu dùng user ID trực tiếp)
        const buyerId = user.publicMetadata?.buyerId || user.id; // Giả sử buyerId lưu trong publicMetadata.buyerId
        if (!buyerId) {
          console.warn('Buyer ID not found in user metadata');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/order_status/summary/buyer/${buyerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order summary');
        }
        const data = await response.json();

        const { totalOrders, totalAmount } = data;

        // Tạo array expenses với dữ liệu từ API cho 2 items đầu, giữ nguyên cấu trúc cho các items sau
        const newExpenses = [
          {
            title: 'Tổng đơn hàng',
            value: `${totalOrders} đơn`,
            icon: 'cart-outline',
            color: '#4CAF50', // Green
            trend: '+12%',
          },
          {
            title: 'Tổng chi tiêu',
            value: `${totalAmount.toLocaleString('vi-VN')} VND`,
            icon: 'wallet-outline',
            color: '#2196F3', // Blue
            trend: '-8%',
          },
          // Giữ nguyên các items sau như mẫu (có thể adjust nếu cần)
          {
            title: 'Tiết kiệm tháng',
            value: '1.200.000 VND',
            icon: 'trending-up-outline',
            color: '#FF7BAC',
            trend: '+15%',
          },
          {
            title: 'Chi tiêu khác',
            value: '450.000 VND',
            icon: 'trending-down-outline',
            color: '#C2185B',
            trend: '-3%',
          },
        ];

        setExpenses(newExpenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        // Fallback data nếu API lỗi
        setExpenses([
          { title: 'Tổng đơn hàng', value: '0 đơn', icon: 'cart-outline', color: '#FF4D79', trend: '+0%' },
          { title: 'Tổng chi tiêu', value: '0 VND', icon: 'wallet-outline', color: '#FF7BAC', trend: '+0%' },
          { title: 'Tiết kiệm tháng', value: '0 VND', icon: 'trending-up-outline', color: '#FF9FC3', trend: '+0%' },
          { title: 'Chi tiêu khác', value: '0 VND', icon: 'trending-down-outline', color: '#C2185B', trend: '+0%' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [isLoaded, isSignedIn, user]); // Depend on Clerk user state

  if (loading || !isLoaded) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quản lý chi tiêu</Text>
        <View style={styles.expenseScroll}>
          <ActivityIndicator size="large" color="#FF4D79" />
        </View>
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quản lý chi tiêu</Text>
        <Text style={styles.expenseValue}>Vui lòng đăng nhập để xem thông tin</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quản lý chi tiêu</Text>
      <View style={styles.expenseGrid}>
        {expenses.map((item, index) => (
          <View
            key={index}
            style={[
              styles.expenseCard,
              {
                backgroundColor:
                  index === 1
                    ? '#FFE6F0'
                    : index === 2
                    ? '#FFF1F7'
                    : index === 3
                    ? '#FFE5EE'
                    : '#FFF7FB',
              },
            ]}
          >
            <View style={styles.expenseHeader}>
              <Icon name={item.icon} size={20} color={item.color} />
              <Text style={styles.expenseTitle}>{item.title}</Text>
            </View>
            <Text style={styles.expenseValue}>{item.value}</Text>
            <Text style={[styles.expenseTrend, { color: item.color }]}>{item.trend}</Text>
            {index === 2 && <Text style={styles.expenseSub}>Áo nữ</Text>}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ExpensesSection;
