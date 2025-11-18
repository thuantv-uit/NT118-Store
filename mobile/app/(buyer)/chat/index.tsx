import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../../theme/colors";
import {
  ConversationSummary,
  useChatApi,
} from "../../../hooks/useChatApi";
import { useChatSocket } from "../../../hooks/useChatSocket";
import { Image } from "expo-image";

function formatTime(iso?: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();

  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  return `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;
}

function getLastMessagePreview(conversation: ConversationSummary) {
  if (!conversation.lastMessage) {
    return "Chưa có tin nhắn";
  }

  if (conversation.lastMessage.imageUrl) {
    return "Đã gửi 1 hình ảnh";
  }

  return conversation.lastMessage.content || "Tin nhắn trống";
}

export default function ConversationListScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { getConversations, createConversation } = useChatApi();
  const { subscribeToMessages, joinConversation, connected } = useChatSocket();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [composerVisible, setComposerVisible] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [composerError, setComposerError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setError(null);
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể tải cuộc trò chuyện";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setError(null);
      setLoading(true);
      getConversations()
        .then(data => setConversations(data))
        .catch(err => {
          const message = err instanceof Error ? err.message : "Không thể tải cuộc trò chuyện";
          setError(message);
        })
        .finally(() => setLoading(false));
    }, [])
  );

  useEffect(() => {
    if (!connected || conversations.length === 0) return;
    conversations.forEach((conversation) => {
      joinConversation(conversation.id);
    });
  }, [connected, conversations.length]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((message) => {
      setConversations((prev) => {
        const index = prev.findIndex(
          (conversation) => conversation.id === message.conversationId
        );

        if (index === -1) {
          fetchConversations();
          return prev;
        }

        const existing = prev[index];
        const updated: ConversationSummary = {
          ...existing,
          lastMessage: {
            id: message.id,
            senderId: message.senderId,
            content: message.content,
            imageUrl: message.imageUrl,
            createdAt: message.createdAt,
          },
          unreadCount:
            message.senderId === user?.id
              ? 0
              : existing.unreadCount + 1,
        };

        const newList = [...prev];
        newList.splice(index, 1);
        newList.unshift(updated);
        return newList;
      });
    });
    
    return unsubscribe;
  }, [user?.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConversations();
  }, []);

  const handleCreateConversation = useCallback(async () => {
    if (!targetUserId.trim()) {
      setComposerError("Vui lòng nhập userId người cần chat");
      return;
    }

    setCreatingConversation(true);
    setComposerError(null);
    try {
      const conversation = await createConversation(targetUserId.trim());
      setConversations((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === conversation.id);
        if (existingIndex !== -1) {
          const copy = [...prev];
          copy.splice(existingIndex, 1);
          return [conversation, ...copy];
        }
        return [conversation, ...prev];
      });
      setComposerVisible(false);
      setTargetUserId("");
      router.push({
        pathname: "/(buyer)/chat/[conversationId]",
        params: { conversationId: conversation.id },
      } as never);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Không thể tạo cuộc trò chuyện";
      setComposerError(message);
    } finally {
      setCreatingConversation(false);
    }
  }, [createConversation, router, targetUserId]);

  const renderConversation = useCallback(
    ({ item }: { item: ConversationSummary }) => {
      const isUnread = item.unreadCount > 0;

      return (
        <TouchableOpacity
          style={styles.conversationCard}
          onPress={() =>
            router.push({
              pathname: "/(buyer)/chat/[conversationId]",
              params: { conversationId: item.id },
            } as never)
          }
        >
          <View style={styles.avatarWrapper}>
            {item.otherUser.avatarUrl ? (
              <Image
                source={{ uri: item.otherUser.avatarUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {item.otherUser.name?.[0]?.toUpperCase() ||
                    item.otherUser.email?.[0]?.toUpperCase() ||
                    "U"}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.conversationContent}>
            <View style={styles.conversationHeader}>
              <Text style={styles.conversationName}>
                {item.otherUser.name || item.otherUser.email || "Người dùng"}
              </Text>
              <Text style={styles.conversationTime}>
                {formatTime(item.lastMessage?.createdAt)}
              </Text>
            </View>
            <View style={styles.conversationPreviewRow}>
              <Text
                style={[
                  styles.conversationPreview,
                  isUnread && styles.unreadPreview,
                ]}
                numberOfLines={1}
              >
                {getLastMessagePreview(item)}
              </Text>
              {isUnread && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [router]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <ActivityIndicator color={colors.primary.main} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tin nhắn</Text>
          <TouchableOpacity
            onPress={() => setComposerVisible((prev) => !prev)}
            style={styles.headerButton}
          >
            <Ionicons
              name={composerVisible ? "close" : "add"}
              size={24}
              color={colors.primary.main}
            />
          </TouchableOpacity>
        </View>

        {composerVisible && (
          <View style={styles.composer}>
            <Text style={styles.composerLabel}>
              Nhập Clerk userId người cần chat
            </Text>
            <View style={styles.composerRow}>
              <TextInput
                style={styles.composerInput}
                placeholder="user_123..."
                value={targetUserId}
                autoCapitalize="none"
                onChangeText={setTargetUserId}
              />
              <TouchableOpacity
                style={styles.composerAction}
                onPress={handleCreateConversation}
                disabled={creatingConversation}
              >
                {creatingConversation ? (
                  <ActivityIndicator color={colors.text.white} />
                ) : (
                  <Ionicons name="send" size={20} color={colors.text.white} />
                )}
              </TouchableOpacity>
            </View>
            {composerError ? (
              <Text style={styles.composerError}>{composerError}</Text>
            ) : null}
          </View>
        )}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchConversations}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="chatbubbles-outline"
                size={48}
                color={colors.icon.inactive}
              />
              <Text style={styles.emptyTitle}>Chưa có cuộc trò chuyện</Text>
              <Text style={styles.emptySubtitle}>
                Hãy chọn một sản phẩm và bắt đầu chat với người bán.
              </Text>
            </View>
          }
          contentContainerStyle={
            conversations.length === 0 ? styles.emptyListContainer : undefined
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Athiti-SemiBold",
    color: colors.text.primary,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderColor: colors.border.medium,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.primary,
  },
  composer: {
    backgroundColor: colors.background.primary,
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  composerLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  composerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  composerInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 16,
    backgroundColor: colors.background.secondary,
  },
  composerAction: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
  },
  composerError: {
    marginTop: 6,
    fontSize: 12,
    color: colors.status.error,
  },
  conversationCard: {
    flexDirection: "row",
    backgroundColor: colors.background.primary,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  avatarWrapper: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary.lightPink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 18,
    fontFamily: "Athiti-SemiBold",
    color: colors.primary.dark,
  },
  conversationContent: {
    flex: 1,
    justifyContent: "center",
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  conversationName: {
    fontSize: 16,
    fontFamily: "Athiti-SemiBold",
    color: colors.text.primary,
  },
  conversationTime: {
    fontSize: 12,
    color: colors.text.light,
  },
  conversationPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  conversationPreview: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
  },
  unreadPreview: {
    fontFamily: "Athiti-SemiBold",
    color: colors.primary.dark,
  },
  unreadBadge: {
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    alignItems: "center",
  },
  unreadBadgeText: {
    color: colors.text.white,
    fontSize: 12,
    fontFamily: "Athiti-SemiBold",
  },
  centeredScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.secondary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Athiti-SemiBold",
    color: colors.text.secondary,
  },
  emptySubtitle: {
    textAlign: "center",
    color: colors.text.light,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  errorBox: {
    padding: 12,
    backgroundColor: colors.secondary.lightPink,
    borderRadius: 12,
    marginBottom: 12,
  },
  errorText: {
    color: colors.status.error,
  },
  retryButton: {
    marginTop: 8,
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
});
