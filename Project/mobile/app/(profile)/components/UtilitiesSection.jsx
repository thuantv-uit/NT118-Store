import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/ProfileStyles';

const UtilitiesSection = ({ utilities }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Tiện ích</Text>
    <View style={styles.utilitiesContainer}>
      {/* Dòng 1: 3 items dọc */}
      <View style={styles.utilityRow}>
        {utilities.slice(0, 3).map((item, index) => (
          <TouchableOpacity key={index} style={styles.utilityItem}>
            <View style={styles.utilityIcon}>
              <Icon name={item.icon} size={32} color="#FF6B9D" />
            </View>
            <Text style={styles.utilityLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Dòng 2: 3 items dọc */}
      <View style={styles.utilityRow}>
        {utilities.slice(3, 6).map((item, index) => (
          <TouchableOpacity key={index + 3} style={styles.utilityItem}>
            <View style={styles.utilityIcon}>
              <Icon name={item.icon} size={32} color="#FF6B9D" />
            </View>
            <Text style={styles.utilityLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </View>
);

export default UtilitiesSection;