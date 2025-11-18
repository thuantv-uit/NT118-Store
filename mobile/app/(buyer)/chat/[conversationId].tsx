import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { colors } from "../../../theme/colors";
import {
  ChatMessage,
  ConversationSummary,
  useChatApi,
} from "../../../hooks/useChatApi";
import { useChatSocket } from "../../../hooks/useChatSocket";
import { uploadChatImage } from "../../../utils/uploadChatImage";

function formatTimeLabel(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export default function ChatRoomScreen() {
  const router = useRouter();
  const { user } = useUser();
  const params = useLocalSearchParams<{ conversationId?: string }>();
  const conversationId = useMemo(() => {
    const value = params.conversationId;
    return Array.isArray(value) ? value[0] : value;
  }, [params.conversationId]);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const { getMessages, sendMessage, getConversations } = useChatApi();
  const { subscribeToMessages } = useChatSocket({ conversationId });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [conversation, setConversation] =
    useState<ConversationSummary | null>(null);

  const otherUserName =
    conversation?.otherUser.name ||
    conversation?.otherUser.email ||
    "Cuộc trò chuyện";

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const loadConversationMeta = useCallback(async () => {
    if (!conversationId) return;
    try {
      const list = await getConversations();
      const found = list.find((item) => item.id === conversationId) || null;
      setConversation(found);
    } catch (err) {
      console.warn("Could not load conversation details", err);
    }
  }, [conversationId]);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể tải tin nhắn";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [conversationId]);

  useFocusEffect(
    useCallback(() => {
      if (!conversationId) return;
      
      // Load conversation details
      getConversations()
        .then(list => {
          const found = list.find((item) => item.id === conversationId) || null;
          setConversation(found);
        })
        .catch(err => console.warn("Could not load conversation details", err));
      
      // Load messages
      setLoading(true);
      setError(null);
      getMessages(conversationId)
        .then(data => setMessages(data))
        .catch(err => {
          const message = err instanceof Error ? err.message : "Không thể tải tin nhắn";
          setError(message);
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    }, [conversationId])
  );

  useEffect(() => {
    const unsubscribe = subscribeToMessages((message) => {
      if (message.conversationId !== conversationId) return;

      setConversation((prev) =>
        prev
          ? {
              ...prev,
              lastMessage: {
                id: message.id,
                senderId: message.senderId,
                content: message.content,
                imageUrl: message.imageUrl,
                createdAt: message.createdAt,
              },
            }
          : prev
      );

      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    });
    
    return unsubscribe;
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!conversationId || !inputValue.trim()) return;
    setSending(true);
    try {
      const message = await sendMessage(conversationId, {
        content: inputValue.trim(),
      });
      setMessages((prev) => [...prev, message]);
      setInputValue("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể gửi tin nhắn";
      Alert.alert("Lỗi", message);
    } finally {
      setSending(false);
    }
  }, [conversationId, inputValue, sendMessage]);

  const handlePickImage = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Quyền bị từ chối",
          "Vui lòng cho phép truy cập thư viện ảnh để gửi hình."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]) {
        return;
      }

      setUploading(true);
      const imageUrl = await uploadChatImage(result.assets[0]);
      const message = await sendMessage(conversationId!, { imageUrl });
      setMessages((prev) => [...prev, message]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể gửi hình ảnh";
      Alert.alert("Lỗi", message);
    } finally {
      setUploading(false);
    }
  }, [conversationId, sendMessage]);

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isOwn = item.senderId === user?.id;
      return (
        <View
          style={[
            styles.messageRow,
            isOwn ? styles.messageRowOwn : styles.messageRowOther,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isOwn ? styles.ownBubble : styles.otherBubble,
            ]}
          >
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.messageImage}
                contentFit="cover"
              />
            ) : null}
            {item.content ? (
              <Text
                style={[
                  styles.messageText,
                  isOwn ? styles.ownText : styles.otherText,
                ]}
              >
                {item.content}
              </Text>
            ) : null}
            <Text style={styles.messageTime}>{formatTimeLabel(item.createdAt)}</Text>
          </View>
        </View>
      );
    },
    [user?.id]
  );

  if (!conversationId) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Thiếu conversationId</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={colors.primary.main} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{otherUserName}</Text>
            {conversation?.lastMessage?.createdAt ? (
              <Text style={styles.headerSubtitle}>
                Hoạt động {formatTimeLabel(conversation.lastMessage.createdAt)}
              </Text>
            ) : null}
          </View>
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={colors.primary.main} size="large" />
          </View>
        ) : (
          <>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => {
                    setRefreshing(true);
                    fetchMessages();
                  }}
                >
                  <Text style={styles.retryText}>Thử lại</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.messageList}
              onRefresh={() => {
                setRefreshing(true);
                fetchMessages();
              }}
              refreshing={refreshing}
            />
          </>
        )}

        <View style={styles.composer}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={handlePickImage}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={colors.primary.dark} />
            ) : (
              <Ionicons
                name="image-outline"
                size={22}
                color={colors.primary.dark}
              />
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Nhập tin nhắn..."
            value={inputValue}
            onChangeText={setInputValue}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputValue.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputValue.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={colors.text.white} />
            ) : (
              <Ionicons name="send" size={20} color={colors.text.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border.medium,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Athiti-SemiBold",
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.text.light,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  messageList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 8,
  },
  messageRow: {
    flexDirection: "row",
    width: "100%",
  },
  messageRowOwn: {
    justifyContent: "flex-end",
  },
  messageRowOther: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginVertical: 4,
    gap: 8,
  },
  ownBubble: {
    backgroundColor: colors.primary.main,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.background.primary,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownText: {
    color: colors.text.white,
  },
  otherText: {
    color: colors.text.primary,
  },
  messageTime: {
    fontSize: 10,
    color: colors.text.light,
    alignSelf: "flex-end",
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  mediaButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: colors.background.secondary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  errorBox: {
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.secondary.lightPink,
  },
  errorText: {
    color: colors.status.error,
  },
  retryButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  retryText: {
    color: colors.primary.main,
    fontFamily: "Athiti-SemiBold",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.secondary,
  },
  messageImage: {
    width: 220,
    height: 180,
    borderRadius: 12,
  },
});
