import { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.7; // Hình lớn

// Styles riêng cho ProductDetail (có thể merge vào HomeStyles nếu muốn)
const detailStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF6F5' },
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  backButton: { fontSize: 24, color: '#6D4C41' },
  image: {
    width: width,
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: -20, // Overlap nhẹ với image
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  name: { fontSize: 20, fontWeight: '700', color: '#5B453F', marginBottom: 4 },
  price: { fontSize: 18, fontWeight: '700', color: '#E64A19', marginBottom: 16 },
  section: {
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#6D4C41', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  selectorItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5C9C4',
    marginRight: 8,
    marginBottom: 8,
  },
  selectorText: { fontSize: 14, color: '#6D4C41' },
  activeSelector: {
    backgroundColor: '#FF8A65',
    borderColor: '#FF8A65',
  },
  activeText: { color: '#fff' },
  description: { fontSize: 14, color: '#8D6E63', lineHeight: 20 },
  addButton: {
    backgroundColor: '#FF8A65',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  addText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});

export default function ProductDetail({ route, navigation }) {  // Nhận route từ navigation (chứa product)
  const { product } = route.params || {};  // Lấy product từ params
  if (!product) return <Text>Không tìm thấy sản phẩm!</Text>;

  // Mock chi tiết thêm (bạn có thể fetch từ API)
  const details = {
    description: `${product.name} là sản phẩm cao cấp, chất liệu cotton 100%, thoải mái cho mọi hoạt động hàng ngày. Thiết kế hiện đại, phù hợp cho cả nam và nữ.`,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Trắng', 'Đen', 'Xanh'],  // Mock colors
  };

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Trắng');

  const renderSelector = (items, onSelect, selected) => (
    <View style={detailStyles.row}>
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            detailStyles.selectorItem,
            selected === item && detailStyles.activeSelector,
          ]}
          onPress={() => onSelect(item)}
        >
          <Text
            style={[
              detailStyles.selectorText,
              selected === item && detailStyles.activeText,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={detailStyles.safe}>
      {/* Back button */}
      <TouchableOpacity style={detailStyles.header} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" style={detailStyles.backButton} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={detailStyles.image} />

        <View style={detailStyles.content}>
          <Text style={detailStyles.name}>{product.name}</Text>
          <Text style={detailStyles.price}>{product.price.toLocaleString()}₫</Text>

          {/* Size selector */}
          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Kích cỡ</Text>
            {renderSelector(details.sizes, setSelectedSize, selectedSize)}
          </View>

          {/* Color selector */}
          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Màu sắc</Text>
            {renderSelector(details.colors, setSelectedColor, selectedColor)}
          </View>

          {/* Description */}
          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Mô tả</Text>
            <Text style={detailStyles.description}>{details.description}</Text>
          </View>

          {/* Add to cart button */}
          <TouchableOpacity style={detailStyles.addButton}>
            <Text style={detailStyles.addText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}