import { FlatList, Image, Text, View } from 'react-native';
import { flashSale } from '../data/homeData';
import { styles } from '../styles/HomeStyles';

export default function FlashSale() {
  const renderFlash = ({ item }) => (
    <View style={styles.flashCard}>
      <Image source={{ uri: item.image }} style={styles.flashImage} />
      <Text style={styles.flashName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.flashPrice}>{item.price.toLocaleString()}₫</Text>
    </View>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Flash Sale</Text>
        <Text style={styles.sectionSub}>Giảm sâu trong thời gian có hạn</Text>
      </View>
      <FlatList
        data={flashSale}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderFlash}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingLeft: 12 }}
      />
    </View>
  );
}