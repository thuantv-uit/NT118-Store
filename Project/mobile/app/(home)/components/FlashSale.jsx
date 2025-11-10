import { FlatList, Image, Text, View } from 'react-native';
import { flashSale } from '../data/homeData';
import { styles } from '../styles/HomeStyles';

export default function FlashSale() {
  const renderFlash = ({ item }) => (
    <View style={styles.flashCard}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.flashImage} />
      <Text style={styles.flashName} numberOfLines={1}>{item.name || 'Sản phẩm'}</Text>
      <Text style={styles.flashPrice}>{(item.price || 0).toLocaleString()}₫</Text>
    </View>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Flash Sale</Text>
        <Text style={styles.sectionSub}>Giảm sâu trong thời gian có hạn</Text>
      </View>
      <FlatList
        data={flashSale || []}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderFlash}
        keyExtractor={(i) => i.id.toString()}
        contentContainerStyle={{ paddingLeft: 12 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', padding: 10 }}>Không có flash sale</Text>}
      />
    </View>
  );
}