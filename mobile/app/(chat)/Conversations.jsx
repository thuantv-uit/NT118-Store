import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../constants/api'; // http://192.168.1.254:5001/api

const ConversationsScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const customerId = user?.id;
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để xem cuộc trò chuyện!');
      return;
    }
    fetchConversations();
  }, [customerId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Query params cho GET chuẩn
      const url = `${API_URL}/chat?user_id=${customerId}&limit=20&offset=0`;
      console.log('Fetch conversations URL: ', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Fetch conversations error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched conversations:', data);
      setConversations(data);

      // Fetch other user info (name, avatar) cho mỗi conv
      const updatedConversations = await Promise.all(
        data.map(async (conv) => {
          const otherId = conv.other_user_id;
          try {
            const otherResponse = await fetch(`${API_URL}/customers/${otherId}`);
            if (otherResponse.ok) {
              const otherUser = await otherResponse.json();
              return {
                ...conv,
                otherName: `${(otherUser.first_name || '').trim()} ${otherUser.last_name || ''}`,
                otherAvatar: otherUser.avatar || null,
              };
            }
          } catch (err) {
            console.warn('Error fetching other user:', err);
          }
          return { ...conv, otherName: 'Người dùng ẩn danh', otherAvatar: null };
        })
      );
      setConversations(updatedConversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
      Alert.alert('Lỗi', 'Không thể tải danh sách cuộc trò chuyện!');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationPress = (conv) => {
    router.push({
      pathname: '(chat)/ChatScreen',
      params: {
        conversationId: conv.id,
        sellerName: conv.otherName, // Giả sử other là seller; chỉnh nếu cần
      },
    });
  };

  // Function mới: Xử lý back về trang trước (home)
  const handleGoBack = () => {
    router.back();  // Quay lại trang trước (thường là home)
  };

  const renderConversation = ({ item }) => {
    // Lấy avatar từ Clerk nếu có, nếu không dùng avatar từ API
    const avatarUrl = item.otherAvatar || user?.imageUrl;
    
    return (
      <TouchableOpacity style={styles.conversationItem} onPress={() => handleConversationPress(item)}>
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: '#E5C9C4' }]}>
              <Icon name="person" size={24} color="#6D4C41" />
            </View>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.otherName}>{item.otherName}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {item.title || 'Cuộc trò chuyện'}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.updatedAt}>
            {new Date(item.updated_at).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
          </Text>
          {item.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread_count > 99 ? '99+' : item.unread_count}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8A65" />
          <Text style={styles.loadingText}>Đang tải cuộc trò chuyện...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lỗi: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchConversations}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFE6F0', '#E6F7FF', '#E0F7FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Header với button back */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#6D4C41" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cuộc trò chuyện của tôi</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchConversations}>
            <Icon name="refresh" size={20} color="#FF8A65" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        {conversations.length === 0 && (
          <View style={styles.emptyContainer}>
            <Icon name="chatbubble-outline" size={64} color="#E5C9C4" />
            <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào</Text>
            <Text style={styles.emptySubtext}>Bắt đầu bằng cách liên hệ với người bán</Text>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5B453F',
    marginLeft: 12,
    flex: 1,  // Để title chiếm không gian giữa
  },
  refreshButton: {
    padding: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 1, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  otherName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B453F',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    color: '#8D6E63',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  updatedAt: {
    fontSize: 12,
    color: '#8D6E63',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#FF8A65',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6D4C41',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF8A65',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6D4C41',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8D6E63',
    textAlign: 'center',
  },
});

export default ConversationsScreen;
