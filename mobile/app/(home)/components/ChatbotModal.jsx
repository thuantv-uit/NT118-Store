import { useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { API_URL1 } from '../../../constants/api';
import { accent, muted, pastelBg, primary, text } from '../_styles/HomeStyles'; // Import theme từ HomeStyles

// const BASE_API_URL = '${API_URL}/ask'; // URL server local mới

export default function ChatbotModal({ visible, onClose }) {
const [messages, setMessages] = useState([
  {
    role: 'assistant',
    content: `Hello! 👋 I'm your AI assistant for the ShinyCloth app.
I'm here to help you understand and use the app's features more effectively.

You can ask questions such as:
• How can a user purchase a product?
• What should I do if I forget my password?
• How does a seller list a new item?
• How can a buyer track an order?
• How does a shipper accept a delivery job?

Feel free to ask your question anytime! 😊`
  }
]);
    const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userQuestion = inputText.trim();
    const userMessage = { role: 'user', content: userQuestion };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Gọi API với body { question: userQuestion }
      const response = await fetch(`${API_URL1}/ask`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userQuestion, // Body theo format bạn yêu cầu
        }),
      });

      // Kiểm tra response status trước khi parse
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      // Cập nhật: Giả sử response có field 'response' (dựa trên body res bạn cung cấp)
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        // Fallback nếu không có 'response', dùng toàn bộ data hoặc error
        console.warn('Response format không có "response":', data);
        setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, tôi nhận được phản hồi không đúng định dạng từ server.' }]);
      }
    } catch (error) {
      // Try-catch chi tiết để bắt lỗi
      console.error('Lỗi khi gọi API:', error);
      
      let errorMessage = 'Đã xảy ra lỗi không mong muốn.';
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Không thể kết nối đến server. Kiểm tra mạng hoặc server đang chạy.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `Lỗi server: ${error.message}`;
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Phản hồi từ server không đúng định dạng.';
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.role === 'user' ? styles.userMessage : styles.assistantMessage
    ]}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assistant ShinyCloth</Text>
          <View style={{ width: 28 }} />
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor={muted}
              multiline
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={loading}
              style={styles.sendButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Icon name="send" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: pastelBg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: primary,
    padding: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  chatList: { padding: 16 },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 6,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: primary,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: accent,
  },
  messageText: { fontSize: 16, color: text },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: accent,
  },
  textInput: {
    flex: 1,
    backgroundColor: accent,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    color: text,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
