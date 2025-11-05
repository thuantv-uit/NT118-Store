import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { products } from '../data/homeData';
import { styles } from '../styles/HomeStyles';

export default function ProductsGrid() {
  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productMeta}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()}₫</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.section, { paddingTop: 6 }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sản phẩm</Text>
        <TouchableOpacity><Text style={styles.sectionMore}>Xem tất cả</Text></TouchableOpacity>
      </View>

      <FlatList
        data={products}
        numColumns={2}
        renderItem={renderProduct}
        keyExtractor={(i) => i.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.productsGrid}
      />
    </View>
  );
}