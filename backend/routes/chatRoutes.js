import express from "express";
import {
  createConversation,
  getConversationsByUser,
  getMessagesByConversation,
  sendMessage
} from "../controllers/chatController.js";

const router = express.Router();

// POST /conversations - Tạo hội thoại mới
router.post("/", createConversation);

// GET /conversations - Lấy danh sách hội thoại của user hiện tại
router.get("/", getConversationsByUser);

// GET /conversations/:id/messages - Lấy tin nhắn trong hội thoại
router.get("/:id/messages", getMessagesByConversation);

// POST /messages - Gửi tin nhắn (cần conversation_id trong body)
router.post("/messages", sendMessage);

export default router;