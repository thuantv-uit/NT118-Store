import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { primary, styles, text } from '../_styles/HomeStyles';

export default function Header({ username, searchQuery, onSearchChange }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.hello}>Xin chào,</Text>
        <Text style={styles.username} numberOfLines={1}>{username || 'User'}</Text>
      </View>

      <View style={styles.headerCenter}>
        <View style={styles.searchBox}>
          <Icon name="search-outline" size={18} color={primary} />
          <TextInput
            placeholder="Tìm deal hot, thương hiệu, danh mục..."
            placeholderTextColor={text + '80'}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.quickAction}>
        <Icon name="camera-outline" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
