import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../_styles/ProfileStyles';

const UtilitiesSection = ({ utilities, onPressItem }) => {
  if (!utilities || utilities.length === 0) return null;

  // Fallback nếu không có onPressItem (navigate trực tiếp)
  const handlePress = (item) => {
    if (onPressItem) {
      onPressItem(item);  // Sử dụng logic từ parent (ví dụ: role check)
    } else if (item?.route) {
      // Fallback: navigate trực tiếp nếu không truyền prop
      // (Nhưng ở ProfileScreen, onPressItem đã có, nên fallback hiếm dùng)
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tiện ích</Text>
      <View style={styles.utilitiesContainer}>
        <View style={styles.utilityRow}>
          {utilities.map((item) => (
            <TouchableOpacity
              key={item.key || item.label}  // Sử dụng key thay vì label để tránh duplicate nếu label giống
              style={styles.utilityItem}
              onPress={() => handlePress(item)}
              activeOpacity={0.85}
            >
              <View style={styles.utilityIcon}>
                <MaterialIcons name={item.icon} size={32} color="#FF4D79" />
              </View>
              <Text style={styles.utilityLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default UtilitiesSection;