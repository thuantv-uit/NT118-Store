import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/HomeStyles';

export default function PromoCard() {
  return (
    <View style={styles.promoWrapper}>
      <View style={styles.promoLeft}>
        <Text style={styles.promoTitle}>Emty Club</Text>
        <Text style={styles.promoDesc}>Deal hot mỗi ngày — giảm đến 50%!</Text>
        <View style={styles.promoRow}>
          <View style={styles.rating}>
            <Icon name="star" size={14} color="#FFD54F" />
            <Text style={styles.ratingText}>4.5</Text>
          </View>
          <TouchableOpacity style={styles.shopNow}>
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Image source={{ uri: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?w=800' }} style={styles.promoImage} />
    </View>
  );
}