import { useAuth } from "@clerk/clerk-expo";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "../constants/api";
import type { ChatMessage } from "./useChatApi";

const FALLBACK_SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

type Handler = (message: ChatMessage) => void;

interface UseChatSocketParams {
  conversationId?: string;
}

export function useChatSocket(params: UseChatSocketParams = {}) {
  const { getToken } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function setupSocket() {
      try {
        const token = await getToken({
          template: process.env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE,
        });

        if (!token || !isMounted) return;

        const socket = io(
          process.env.EXPO_PUBLIC_SOCKET_URL || FALLBACK_SOCKET_URL,
          {
            transports: ["websocket"],
            auth: { token },
          }
        );

        socketRef.current = socket;

        socket.on("connect", () => {
          setConnected(true);
          setSocketError(null);
        });

        socket.on("disconnect", () => setConnected(false));
        socket.on("connect_error", (error) =>
          setSocketError(error.message || "Unable to connect to chat server")
        );
        socket.on("chat-error", (error) =>
          setSocketError(error?.message || "Chat error")
        );
      } catch (error) {
        if (error instanceof Error) {
          setSocketError(error.message);
        } else {
          setSocketError("Unable to initialize chat socket");
        }
      }
    }

    setupSocket();

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [getToken]);

  useEffect(() => {
    if (!params.conversationId) return;
    if (!socketRef.current || !socketRef.current.connected) return;

    socketRef.current.emit("join-conversation", params.conversationId);
  }, [params.conversationId, connected]);

  const joinConversation = useCallback((conversationId: string) => {
    if (!conversationId || !socketRef.current) return;
    socketRef.current.emit("join-conversation", conversationId);
  }, []);

  const sendMessage = useCallback(
    (payload: { conversationId: string; content?: string; imageUrl?: string }) =>
      socketRef.current?.emit("send-message", payload),
    []
  );

  const subscribeToMessages = useCallback((handler: Handler) => {
    if (!socketRef.current) return () => undefined;
    socketRef.current.on("new-message", handler);
    return () => {
      socketRef.current?.off("new-message", handler);
    };
  }, []);

  return {
    socket: socketRef.current,
    connected,
    error: socketError,
    joinConversation,
    sendMessage,
    subscribeToMessages,
  };
}
