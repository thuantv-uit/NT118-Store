import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';
import { API_URL } from '../../constants/api';

const ChatScreen = () => {
  const params = useLocalSearchParams();
  // console.log("params: ", params);
  const router = useRouter();
  const { conversationId, sellerName } = params;
  // console.log("conversationId: ", conversationId);
  const { user } = useUser();
  const customerId = user?.id;
  // console.log("customerId: ", customerId);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);  // Loading cho send message
  const flatListRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!customerId || !conversationId) {
      Alert.alert('Lỗi', 'Không tìm thấy cuộc trò chuyện!');
      router.back();
      return;
    }

    socketRef.current = io(API_URL.replace('/api', ''));
    socketRef.current.emit('join_room', `conversation_${conversationId}`);

    socketRef.current.on('new_message', (newMsg) => {
      if (newMsg.conversation_id === conversationId.toString()) {
        setMessages(prev => [...prev, newMsg]);
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [conversationId, customerId]);

  useEffect(() => {
    fetchMessages();
  }, [conversationId, customerId]);

  const fetchMessages = async () => {
  try {
    setLoading(true);
    
    // Thêm user_id vào query params thay vì body
    const url = `${API_URL}/chat/${conversationId}/messages?user_id=${customerId}`;
    // console.log('Fetch URL: ', url);  // Log để debug
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Không cần body cho GET!
    });

    if (!response.ok) {
      const errorText = await response.text();
      // console.log('Fetch messages error:', errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    // console.log('Fetched messages:', data);  // Log data để kiểm tra
    setMessages(data);
    flatListRef.current?.scrollToEnd({ animated: true });
  } catch (err) {
    // console.error('Error fetching messages:', err);
    Alert.alert('Lỗi', 'Không thể tải tin nhắn!');
  } finally {
    setLoading(false);
  }
};

  const sendMessage = async () => {
    if (!messageText.trim() || !customerId || sending) return;

    setSending(true);
    try {
      const response = await fetch(`${API_URL}/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          message_text: messageText,
          user_id: customerId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        // console.log('Send message error:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const newMsg = await response.json();
      setMessages(prev => [...prev, newMsg]);
      setMessageText('');
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      // console.error('Error sending message:', err);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn!');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender_id === customerId;
    return (
      <View style={[
        styles.messageContainer,
        isMe ? styles.myMessage : styles.otherMessage
      ]}>
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText]}>
            {item.message_text}
          </Text>
        </View>
        <Text style={styles.messageTime}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8A65" />
          <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#6D4C41" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat với {sellerName}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
      />

      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TextInput
          style={styles.textInput}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#8D6E63"
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, sending && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF6F5' 
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5C9C4',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#5B453F', 
    marginLeft: 12 
  },
  messagesList: { 
    flex: 1, 
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  messagesContent: {
    paddingBottom: 8,
  },
  messageContainer: { 
    marginBottom: 12, 
    maxWidth: '80%' 
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
  },
  myMessage: { 
    alignSelf: 'flex-end' 
  },
  otherMessage: { 
    alignSelf: 'flex-start' 
  },
  myBubble: { 
    backgroundColor: '#FF8A65' 
  },
  otherBubble: { 
    backgroundColor: '#F5F5F5' 
  },
  messageText: { 
    fontSize: 14, 
    lineHeight: 20 
  },
  myText: { 
    color: '#fff' 
  },
  otherText: { 
    color: '#5B453F' 
  },
  messageTime: { 
    fontSize: 10, 
    color: '#8D6E63', 
    alignSelf: 'flex-end', 
    marginTop: 4,
    marginRight: 4,
  },
  inputContainer: { 
    flexDirection: 'row', 
    padding: 16, 
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5C9C4',
  },
  textInput: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#E5C9C4', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    marginRight: 8,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: { 
    backgroundColor: '#FF8A65', 
    borderRadius: 20, 
    width: 44, 
    height: 44, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendButtonDisabled: {
    backgroundColor: '#E64A19',
  },
});

export default ChatScreen;
