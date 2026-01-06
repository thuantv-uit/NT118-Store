import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { categories } from '../_data/homeData';
import { primary, styles } from '../_styles/HomeStyles';

export default function Categories({ onCategorySelect }) {
  const router = useRouter();
  
  const handleCategoryPress = (category) => {
    // Navigate đến màn hình hiển thị sản phẩm theo category
    router.push({
      pathname: '/(home)/category-products',
      params: {
        categoryId: category.id,
        categoryName: category.name
      }
    });
  };
  
  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={styles.categoryIconWrapper}>
        {item.icon ? (
          <Ionicons name={item.icon} size={30} color={primary} />
        ) : (
          <Image source={item.image ? { uri: item.image } : { uri: "https://res.cloudinary.com/dprqatuel/image/upload/v1767707067/Logo_welcome_ox6sil.svg" }} style={styles.categoryIcon} />
        )}
      </View>
      <Text style={styles.categoryLabel} numberOfLines={1}>{item.name || 'Danh mục'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <TouchableOpacity onPress={() => console.log('View all categories')}>
          <Text style={styles.sectionMore}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories || []}
        numColumns={4}
        renderItem={renderCategory}
        keyExtractor={(i) => i.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.categoriesGrid}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text>Không có danh mục</Text>
          </View>
        }
      />
    </View>
  );
}
