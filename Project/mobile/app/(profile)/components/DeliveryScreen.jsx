// DeliveryScreen.jsx
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Giả định dùng Ionicons cho back button
// import { buyerStyles } from '../styles/BuyerStyles'; // Reuse styles nếu có, hoặc tạo mới
import { styles } from '../styles/ProfileStyles';


export default function DeliveryScreen() {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Icon name="arrow-back" size={24} color="#6D4C41" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông tin giao hàng</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ padding: 20 }}>
            {/* Nội dung test đơn giản */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Trang Giao Hàng (Test)
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 20 }}>
              Đây là trang quản lý thông tin giao hàng. Bạn có thể thêm địa chỉ, chọn phương thức giao, v.v.
            </Text>

            {/* Ví dụ form đơn giản */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Phương thức giao hàng</Text>
              <TouchableOpacity style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
                <Text>Tiêu chuẩn (3-5 ngày)</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Địa chỉ mặc định</Text>
              <Text>123 Đường ABC, Quận 1, TP. HCM</Text>
            </View>

            {/* Nút test */}
            <TouchableOpacity 
              style={{ 
                backgroundColor: '#6D4C41', 
                padding: 15, 
                borderRadius: 5, 
                alignItems: 'center' 
              }}
              onPress={() => alert('Test nút giao hàng!')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cập nhật giao hàng</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}