import { sql } from "../config/database.js";

// Tạo hội thoại mới (nếu chưa tồn tại giữa buyer và seller) - Bỏ order_id
export async function createConversation(req, res) {
  try {
    const { buyer_id, seller_id, title, user_id } = req.body; // Lấy user_id từ body

    if (!user_id) {
      return res.status(400).json({ message: "User ID là bắt buộc (thêm vào body)" });
    }

    if (!buyer_id || !seller_id) {
      return res.status(400).json({ message: "Buyer ID và Seller ID là bắt buộc" });
    }

    // Check role: Người tạo (user_id) phải là buyer hoặc seller
    const user = await sql`SELECT role FROM customer WHERE id = ${user_id}`;
    if (user.length === 0 || (user[0].role !== 'buyer' && user[0].role !== 'seller')) {
      return res.status(403).json({ message: "User không có quyền tạo hội thoại (phải là buyer hoặc seller)" });
    }

    // Check nếu hội thoại đã tồn tại giữa 2 người (bỏ order_id)
    let existingConv = await sql`
      SELECT id FROM conversations 
      WHERE ((buyer_id = ${buyer_id} AND seller_id = ${seller_id}) 
      OR (buyer_id = ${seller_id} AND seller_id = ${buyer_id}))
    `;

    if (existingConv.length > 0) {
      return res.status(200).json(existingConv[0]);
    }

    // Tạo hội thoại mới (đảm bảo buyer là buyer, seller là seller dựa trên role)
    const normalizedBuyer = user[0].role === 'buyer' ? user_id : buyer_id;
    const normalizedSeller = user[0].role === 'seller' ? user_id : seller_id;

    // Check role của normalizedBuyer và normalizedSeller để đảm bảo đúng
    const buyerCheck = await sql`SELECT role FROM customer WHERE id = ${normalizedBuyer}`;
    const sellerCheck = await sql`SELECT role FROM customer WHERE id = ${normalizedSeller}`;
    if (buyerCheck.length === 0 || buyerCheck[0].role !== 'buyer' || sellerCheck.length === 0 || sellerCheck[0].role !== 'seller') {
      return res.status(400).json({ message: "Buyer phải có role 'buyer', seller phải có role 'seller'" });
    }

    const newConv = await sql`
      INSERT INTO conversations (buyer_id, seller_id, title)
      VALUES (${normalizedBuyer}, ${normalizedSeller}, ${title || null})
      RETURNING id, buyer_id, seller_id, title, created_at, updated_at
    `;

    res.status(201).json(newConv[0]);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
}

// Lấy danh sách hội thoại của user - Bỏ order_id
export async function getConversationsByUser(req, res) {
  try {
    const { user_id } = req.body; // Lấy user_id từ body
    const { limit = 20, offset = 0 } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "User ID là bắt buộc (thêm vào body)" });
    }

    // Check user tồn tại và có role phù hợp
    const user = await sql`SELECT role FROM customer WHERE id = ${user_id}`;
    if (user.length === 0 || (user[0].role !== 'buyer' && user[0].role !== 'seller')) {
      return res.status(403).json({ message: "User không có quyền xem hội thoại" });
    }

    // Lấy hội thoại nơi user là buyer hoặc seller (bỏ order_id)
    const conversations = await sql`
      SELECT c.id, c.title, c.updated_at,
             CASE 
               WHEN c.buyer_id = ${user_id} THEN c.seller_id 
               ELSE c.buyer_id 
             END as other_user_id,
             (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.is_read = false 
              AND m.sender_id != ${user_id}) as unread_count
      FROM conversations c
      WHERE c.buyer_id = ${user_id} OR c.seller_id = ${user_id}
      ORDER BY c.updated_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
}

// Lấy tin nhắn trong một hội thoại (cập nhật: dùng req.query.user_id cho GET)
export async function getMessagesByConversation(req, res) {
  try {
    const { id } = req.params; // conversation_id
    const { user_id } = req.query; // Đổi từ req.body sang req.query cho GET chuẩn
    const { limit = 50, offset = 0 } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "User ID là bắt buộc (thêm vào query params)" });
    }

    // Check quyền truy cập: user phải là buyer hoặc seller của hội thoại
    const conv = await sql`
      SELECT id FROM conversations 
      WHERE id = ${id} AND (buyer_id = ${user_id} OR seller_id = ${user_id})
    `;

    if (conv.length === 0) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập hội thoại này" });
    }

    // Mark as read cho user hiện tại
    await sql`
      UPDATE messages 
      SET is_read = true, updated_at = CURRENT_TIMESTAMP 
      WHERE conversation_id = ${id} AND sender_id != ${user_id} AND is_read = false
    `;

    const allMessages = await sql`
      SELECT id, conversation_id, sender_id, message_text, is_read, created_at
      FROM messages 
      WHERE conversation_id = ${id}
      ORDER BY created_at ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    res.status(200).json(allMessages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
}

// Gửi tin nhắn mới (không thay đổi)
export async function sendMessage(req, res) {
  try {
    const { conversation_id, message_text, user_id } = req.body; // Lấy user_id từ body (làm sender_id)

    if (!user_id) {
      return res.status(400).json({ message: "User ID là bắt buộc (thêm vào body, sẽ là sender)" });
    }

    if (!conversation_id || !message_text) {
      return res.status(400).json({ message: "Conversation ID và nội dung tin nhắn là bắt buộc" });
    }

    // Check quyền: sender phải là participant
    const conv = await sql`
      SELECT id FROM conversations 
      WHERE id = ${conversation_id} AND (buyer_id = ${user_id} OR seller_id = ${user_id})
    `;

    if (conv.length === 0) {
      return res.status(403).json({ message: "Bạn không có quyền gửi tin nhắn trong hội thoại này" });
    }

    // Lưu message vào DB (sender_id = user_id)
    const newMessage = await sql`
      INSERT INTO messages (conversation_id, sender_id, message_text)
      VALUES (${conversation_id}, ${user_id}, ${message_text})
      RETURNING id, conversation_id, sender_id, message_text, is_read, created_at
    `;

    // Cập nhật updated_at của conversation
    await sql`
      UPDATE conversations 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${conversation_id}
    `;

    // Emit realtime qua Socket.io
    if (global.io) {
      global.io.to(`conversation_${conversation_id}`).emit('new_message', newMessage[0]);
    }

    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
}