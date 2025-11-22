import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/HomeStyles';

export default function Header({ username, searchQuery, onSearchChange }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.hello}>Hi, <Text style={styles.username}>{username || 'User'}</Text></Text>
      </View>

      <View style={styles.headerCenter}>
        <View style={styles.searchBox}>
          <Icon name="search-outline" size={18} color="#BDAAA8" />
          <TextInput
            placeholder="Clothing"
            placeholderTextColor="#BDAAA8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.headerRight}>
        <Icon name="camera-outline" size={22} color="#6D4C41" />
      </TouchableOpacity>
    </View>
  );
}