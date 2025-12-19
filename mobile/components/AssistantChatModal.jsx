import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import axios from 'axios';
import { API_URL } from '../constants/api';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

export default function AssistantChatModal({ visible, onClose, customerId }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Xin chào! Tôi là trợ lý mua sắm của bạn. Tôi có thể trả lời câu hỏi chung và giúp bạn:\n\n• Tìm kiếm sản phẩm\n• Kiểm tra đơn hàng\n• Hướng dẫn đặt hàng\n• Thanh toán\n\nBạn cần hỗ trợ gì không?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [pickedImage, setPickedImage] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);

  const quickActions = [
    { id: '1', text: 'Đơn hàng của tôi', icon: 'cube-outline' },
    { id: '2', text: 'Tìm sản phẩm', icon: 'search-outline' },
    { id: '3', text: 'Cách đặt hàng', icon: 'help-circle-outline' },
    { id: '4', text: 'Thanh toán', icon: 'card-outline' },
  ];

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/assistant/chat`, {
        message: text.trim(),
        customerId: customerId,
        conversationHistory: messages.slice(-10).map(m => ({
          role: m.isBot ? 'assistant' : 'user',
          content: m.text
        }))
      });

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.reply || 'Tôi đã nhận câu hỏi của bạn. Bạn có thể hỏi thêm về sản phẩm hoặc bất kỳ nội dung nào.',
        isBot: true,
        timestamp: new Date(),
        suggestions: response.data.suggestions || quickActions.map(q => q.text)
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.',
        isBot: true,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text) => {
    sendMessage(text);
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện để gửi hình ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setPickedImage(uri);
      sendMessage(`Đã nhận hình ảnh: ${uri}`);
    }
  };

  const transcribeAudio = async (uri) => {
    const formData = new FormData();
    formData.append('audio', {
      uri,
      name: 'recording.m4a',
      type: 'audio/m4a',
    });
    const res = await fetch(`${API_URL}/assistant/transcribe`, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (!res.ok) throw new Error(`Transcribe failed ${res.status}`);
    const data = await res.json();
    return data.text || '';
  };

  const handleToggleRecording = async () => {
    try {
      if (isRecording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setIsRecording(false);
        setRecording(null);
        if (!uri) return;
        setIsTranscribing(true);
        try {
          const text = await transcribeAudio(uri);
          if (text) {
            sendMessage(text);
          } else {
            sendMessage(`Đã nhận ghi âm: ${uri}`);
          }
        } catch (err) {
          console.warn('Transcribe error', err);
          sendMessage(`Đã nhận ghi âm: ${uri}`);
        } finally {
          setIsTranscribing(false);
        }
        return;
      }

      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Quyền micro', 'Cần quyền micro để ghi âm.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.warn('Ghi âm lỗi:', err);
      setIsRecording(false);
      setRecording(null);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isBot ? styles.botMessage : styles.userMessage
    ]}>
      {item.isBot && (
        <View style={styles.botAvatar}>
          <Ionicons name="sparkles" size={16} color="white" />
        </View>
      )}
      <View style={[
        styles.messageBubble,
        item.isBot ? styles.botBubble : styles.userBubble,
        item.isError && styles.errorBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isBot ? styles.botText : styles.userText
        ]}>
          {item.text}
        </Text>
        {item.suggestions && item.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {item.suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => sendMessage(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Ionicons name="sparkles" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Trợ lý mua sắm</Text>
              <View style={styles.onlineIndicator}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Luôn sẵn sàng</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang trả lời...</Text>
      </View>
    )}

    {isTranscribing && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang chuyển giọng nói thành văn bản...</Text>
      </View>
    )}

        {/* Quick actions near input */}
        <View style={styles.quickActionsContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={quickActions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleQuickAction(item.text)}
              >
                <Ionicons name={item.icon} size={18} color={COLORS.primary} />
                <Text style={styles.quickActionText}>{item.text}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.quickActionsList}
          />
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[styles.iconButton, isRecording && styles.iconButtonActive]}
            onPress={handleToggleRecording}
          >
            <Ionicons name={isRecording ? 'mic' : 'mic-outline'} size={20} color={isRecording ? '#fff' : COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handlePickImage}>
            <Ionicons name="image-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Nhập hoặc nói câu hỏi của bạn..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={inputText.trim() && !isLoading ? 'white' : '#ccc'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.primary || '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    color: '#666',
  },
  closeButton: {
    padding: 8,
  },
  quickActionsContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  quickActionsList: {
    paddingHorizontal: 16,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  quickActionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary || '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  botBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: COLORS.primary || '#FF6B6B',
    borderBottomRightRadius: 4,
  },
  errorBubble: {
    backgroundColor: '#FFE5E5',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  botText: {
    color: '#333',
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  suggestionText: {
    fontSize: 13,
    color: '#666',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary || '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  iconButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});
