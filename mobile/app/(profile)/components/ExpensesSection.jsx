import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { API_URL } from '../../../constants/api';
import { styles } from '../_styles/ProfileStyles';
import { useCustomerProfile } from '../../../utlis/useCustomerProfile';

const { width } = Dimensions.get('window');

const ExpensesSection = () => {
  /* -------------------- AUTH & PROFILE -------------------- */
  const { isLoaded, isSignedIn, user } = useUser();
  const { profile, loading: profileLoading } = useCustomerProfile();
  const role = profile?.role;

  /* -------------------- STATE -------------------- */
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    // ❗ Hook LUÔN được gọi – chỉ chặn logic bên trong
    if (profileLoading || role !== 'buyer') {
      setLoading(false);
      return;
    }

    const fetchExpenses = async () => {
      try {
        if (!isLoaded || !isSignedIn || !user) {
          setLoading(false);
          return;
        }

        const buyerId = user.publicMetadata?.buyerId || user.id;
        if (!buyerId) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/order_status/summary/buyer/${buyerId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch order summary');
        }

        const data = await response.json();
        const { totalOrders, totalAmount } = data;

        setExpenses([
          {
            title: 'Tổng đơn hàng',
            value: `${totalOrders} đơn`,
            icon: 'cart-outline',
            color: '#4CAF50',
            trend: '+12%',
          },
          {
            title: 'Tổng chi tiêu',
            value: `${totalAmount.toLocaleString('vi-VN')} VND`,
            icon: 'wallet-outline',
            color: '#2196F3',
            trend: '-8%',
          },
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
        ]);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [profileLoading, role, isLoaded, isSignedIn, user]);

  /* -------------------- RENDER GUARD -------------------- */
  // ⛔ Sau hook mới được return
  if (profileLoading || role !== 'buyer') {
    return null;
  }

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
        <Text style={styles.expenseValue}>
          Vui lòng đăng nhập để xem thông tin
        </Text>
      </View>
    );
  }

  /* -------------------- UI (GIỮ NGUYÊN CSS CŨ) -------------------- */
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

            <Text
              style={[
                styles.expenseTrend,
                { color: item.color },
              ]}
            >
              {item.trend}
            </Text>

            {index === 2 && (
              <Text style={styles.expenseSub}>Áo nữ</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ExpensesSection;
