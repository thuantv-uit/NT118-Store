import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, TouchableOpacity, View } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from 'react-native-vector-icons';
import { gradientEnd, gradientStart, styles, text } from '../_styles/HomeStyles';

export default function PromoCard() {
  return (
    <View style={styles.promoWrapper}>
      <LinearGradient
        colors={['#120b1d', '#2a0f2f', '#ff4d79']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 18 }}
      >
        <View style={styles.promoInner}>
          <View style={styles.promoLeft}>
            <Text style={[styles.promoTitle, { color: '#FFE8F2' }]}>Pink Friday</Text>
            <Text style={[styles.promoDesc, { color: '#F9DCEB' }]}>
              Ưu đãi độc quyền cho thành viên — miễn phí giao nhanh và voucher 50%
            </Text>
            <View style={styles.promoRow}>
              <View style={styles.rating}>
                <Ionicons name="sparkles-outline" size={14} color={gradientEnd} />
                <Text style={[styles.ratingText, { color: gradientEnd }]}>Deal nổi bật</Text>
              </View>
              <TouchableOpacity
                style={styles.shopNow}
                onPress={() => console.log('Shop now pressed')}
              >
                <Text style={styles.shopNowText}>Mua ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.promoImageWrapper}>
            <View style={styles.promoGlow} />
            <Image
              source={require('../../../assets/images/home_seller/black_friday/black_friday.jpg')}
              style={styles.promoImage}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
