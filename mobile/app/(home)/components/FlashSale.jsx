import { FlatList, Image, Text, View } from 'react-native';
import { flashSale } from '../_data/homeData';
import { styles } from '../_styles/HomeStyles';

export default function FlashSale() {
  const renderFlash = ({ item }) => {
    const source = typeof item.image === 'string' ? { uri: item.image } : item.image;
    return (
      <View style={styles.flashCard}>
        <Image source={source} style={styles.flashImage} />
        <Text style={styles.flashName} numberOfLines={1}>{item.name || 'Sản phẩm'}</Text>
        <Text style={styles.flashPrice}>{(item.price || 0).toLocaleString()}₫</Text>
        <View style={styles.flashChip}>
          <Text style={styles.flashChipText}>Giảm sốc</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Flash Sale</Text>
        <Text style={styles.sectionSub}>Deal hời chỉ trong hôm nay</Text>
      </View>
      <FlatList
        data={flashSale || []}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderFlash}
        keyExtractor={(i) => i.id.toString()}
        contentContainerStyle={{ paddingLeft: 12, paddingRight: 4 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', padding: 10 }}>Không có flash sale</Text>}
      />
    </View>
  );
}
