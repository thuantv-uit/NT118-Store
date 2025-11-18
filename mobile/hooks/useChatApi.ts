import { useAuth } from "@clerk/clerk-expo";
import { useCallback } from "react";
import { API_URL } from "../constants/api";

export interface ChatUser {
  id: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  isRead: boolean;
  sender?: ChatUser;
}

export interface ConversationSummary {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
  otherUser: ChatUser;
  lastMessage?: Omit<ChatMessage, "conversationId" | "isRead" | "sender"> | null;
  unreadCount: number;
}

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

const CHAT_BASE_URL = `${API_URL}`;

export function useChatApi() {
  const { getToken } = useAuth();

  const authorizedFetch = useCallback(
    async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
      const token = await getToken({
        template: process.env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE,
      });

      if (!token) {
        throw new Error("Unable to retrieve session token");
      }

      const headers: Record<string, string> = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      if (
        options.body &&
        !(options.body instanceof FormData) &&
        !headers["Content-Type"]
      ) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(`${CHAT_BASE_URL}${path}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Chat API request failed");
      }

      if (response.status === 204) {
        return null as T;
      }

      return (await response.json()) as T;
    },
    [getToken]
  );

  const getConversations = useCallback(
    () => authorizedFetch<ConversationSummary[]>("/conversations"),
    [authorizedFetch]
  );

  const createConversation = useCallback(
    (otherUserId: string) =>
      authorizedFetch<ConversationSummary>("/conversations", {
        method: "POST",
        body: JSON.stringify({ otherUserId }),
      }),
    [authorizedFetch]
  );

  const getMessages = useCallback(
    (conversationId: string, params?: { page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", String(params.page));
      if (params?.limit) searchParams.append("limit", String(params.limit));
      const query = searchParams.toString();
      const path = `/conversations/${conversationId}/messages${
        query ? `?${query}` : ""
      }`;
      return authorizedFetch<ChatMessage[]>(path);
    },
    [authorizedFetch]
  );

  const sendMessage = useCallback(
    (
      conversationId: string,
      payload: { content?: string; imageUrl?: string }
    ) =>
      authorizedFetch<ChatMessage>(`/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    [authorizedFetch]
  );

  const startConversationWithSeller = useCallback(
    (productId: string | number) =>
      authorizedFetch<ConversationSummary>(`/product/${productId}/chat`, {
        method: "POST",
      }),
    [authorizedFetch]
  );

  return {
    getConversations,
    getMessages,
    sendMessage,
    createConversation,
    startConversationWithSeller,
  };
}
