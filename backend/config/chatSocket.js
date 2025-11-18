import { authenticateClerkToken } from "./clerk.js";
import { createMessage } from "../services/chatService.js";

export function initChatSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const userId = await authenticateClerkToken(token);
      socket.userId = userId;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-conversation", (conversationId) => {
      if (!conversationId) {
        return;
      }
      socket.join(conversationId);
    });

    socket.on("send-message", async (payload = {}) => {
      try {
        if (!payload.conversationId) {
          throw new Error("conversationId is required");
        }

        const message = await createMessage(
          payload.conversationId,
          socket.userId,
          payload.content,
          payload.imageUrl
        );

        io.to(payload.conversationId).emit("new-message", message);
      } catch (error) {
        socket.emit("chat-error", { message: error.message });
      }
    });
  });
}
