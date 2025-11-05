import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { categories } from '../data/homeData';
import { styles } from '../styles/HomeStyles';

export default function Categories() {
  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIconWrapper}>
        <Image source={{ uri: item.image }} style={styles.categoryIcon} />
      </View>
      <Text style={styles.categoryLabel} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <TouchableOpacity><Text style={styles.sectionMore}>Xem tất cả</Text></TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        numColumns={4}
        renderItem={renderCategory}
        keyExtractor={(i) => i.id}
        scrollEnabled={false}
        contentContainerStyle={styles.categoriesGrid}
      />
    </View>
  );
}