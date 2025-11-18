import {
  ensureUserProfile,
  findOrCreateConversation,
  getConversationForUser,
  getUserConversations as fetchUserConversations,
  getConversationMessages as fetchConversationMessages,
  createMessage as persistMessage,
  getSellerByProductId,
} from "../services/chatService.js";

export async function createOrGetConversation(req, res) {
  try {
    const currentUserId = req.auth?.userId;
    const { otherUserId } = req.body || {};

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!otherUserId || typeof otherUserId !== "string") {
      return res
        .status(400)
        .json({ message: "otherUserId is required to create conversation" });
    }

    if (otherUserId === currentUserId) {
      return res
        .status(400)
        .json({ message: "Cannot start a conversation with yourself" });
    }

    await Promise.all([
      ensureUserProfile(currentUserId),
      ensureUserProfile(otherUserId),
    ]);

    const conversation = await findOrCreateConversation(
      currentUserId,
      otherUserId
    );
    const payload = await getConversationForUser(
      conversation.id,
      currentUserId
    );

    res.status(200).json(payload);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Failed to create conversation" });
  }
}

export async function getConversations(req, res) {
  try {
    const currentUserId = req.auth?.userId;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await ensureUserProfile(currentUserId);
    const conversations = await fetchUserConversations(currentUserId);
    res.json(conversations);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Failed to load conversations" });
  }
}

export async function getMessages(req, res) {
  try {
    const currentUserId = req.auth?.userId;
    const conversationId = req.params.id;
    const { page, limit } = req.query;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    const messages = await fetchConversationMessages(
      conversationId,
      currentUserId,
      { page, limit }
    );

    res.json(messages);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Failed to load messages" });
  }
}

export async function sendMessage(req, res) {
  try {
    const currentUserId = req.auth?.userId;
    const conversationId = req.params.id;
    const { content, imageUrl } = req.body || {};

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    const message = await persistMessage(
      conversationId,
      currentUserId,
      content,
      imageUrl
    );

    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("new-message", message);
    }

    res.status(201).json(message);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Failed to send message" });
  }
}

export async function startProductConversation(req, res) {
  try {
    const currentUserId = req.auth?.userId;
    const { id: productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const { sellerId } = await getSellerByProductId(productId);

    if (sellerId === currentUserId) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    await Promise.all([
      ensureUserProfile(currentUserId),
      ensureUserProfile(sellerId),
    ]);

    const conversation = await findOrCreateConversation(
      currentUserId,
      sellerId
    );
    const payload = await getConversationForUser(
      conversation.id,
      currentUserId
    );

    res.json(payload);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({
        message: error.message || "Failed to start chat with seller",
      });
  }
}
