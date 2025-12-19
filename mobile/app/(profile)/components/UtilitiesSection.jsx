import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../_styles/ProfileStyles';

const UtilitiesSection = ({ utilities }) => {
  const router = useRouter();

  if (!utilities || utilities.length === 0) return null;

  const handleUtilityPress = (item) => {
    if (item?.route) {
      router.push(item.route);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tiện ích</Text>
      <View style={styles.utilitiesContainer}>
        <View style={styles.utilityRow}>
          {utilities.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.utilityItem}
              onPress={() => handleUtilityPress(item)}
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
