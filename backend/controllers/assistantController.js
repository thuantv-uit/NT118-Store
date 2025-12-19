import { getAIResponse } from '../services/assistantService.js';
import { transcribeAudioBuffer } from '../services/assistantService.js';
import { sql } from '../config/database.js';

/**
 * Xử lý chat message từ user
 */
export async function handleChat(req, res) {
  try {
    const { message, customerId, conversationHistory } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }

    // Lấy context của user (đơn hàng gần đây, giỏ hàng)
    const context = await getUserContext(customerId);

    // Gọi AI service
    const aiResponse = await getAIResponse(message, {
      ...context,
      conversationHistory: conversationHistory || []
    });

    // Log conversation (optional - để phân tích sau này)
    if (customerId) {
      await logConversation(customerId, message, aiResponse.reply);
    }

    res.json({
      success: true,
      reply: aiResponse.reply,
      suggestions: aiResponse.suggestions || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Assistant Chat Error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      reply: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.',
      suggestions: []
    });
  }
}

/**
 * Chuyển giọng nói thành văn bản
 */
export async function handleTranscribe(req, res) {
  try {
    const file = req.file;
    if (!file || !file.buffer) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const text = await transcribeAudioBuffer(file);
    res.json({ success: true, text });
  } catch (error) {
    console.error('Transcribe error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to transcribe audio',
      text: '',
    });
  }
}

/**
 * Lấy context của user để AI hiểu rõ hơn
 */
async function getUserContext(customerId) {
  if (!customerId) {
    return {};
  }

  try {
    // Lấy đơn hàng gần đây (5 đơn cuối)
    const recentOrders = await sql`
      SELECT 
        o.id,
        o.status,
        o.total_amount,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.customer_id = ${customerId}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `;

    // Lấy giỏ hàng hiện tại
    const cartItems = await sql`
      SELECT 
        c.id,
        c.quantity,
        p.name,
        p.price
      FROM carts c
      JOIN products p ON c.product_id = p.id
      WHERE c.customer_id = ${customerId}
    `;

    // Lấy thông tin khách hàng
    const customer = await sql`
      SELECT first_name, last_name, role
      FROM customer
      WHERE id = ${customerId}
      LIMIT 1
    `;

    return {
      recentOrders,
      cartItems,
      customerInfo: customer[0] || null
    };

  } catch (error) {
    console.error('Error getting user context:', error);
    return {};
  }
}

/**
 * Log conversation để phân tích
 */
async function logConversation(customerId, userMessage, botReply) {
  try {
    // Tạo bảng assistant_conversations nếu chưa có
    await sql`
      CREATE TABLE IF NOT EXISTS assistant_conversations (
        id SERIAL PRIMARY KEY,
        customer_id VARCHAR(255) NOT NULL,
        user_message TEXT NOT NULL,
        bot_reply TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      INSERT INTO assistant_conversations 
        (customer_id, user_message, bot_reply)
      VALUES 
        (${customerId}, ${userMessage}, ${botReply})
    `;
  } catch (error) {
    // Không throw error để không ảnh hưởng response chính
    console.error('Error logging conversation:', error);
  }
}

/**
 * Lấy lịch sử chat của user
 */
export async function getChatHistory(req, res) {
  try {
    const { customerId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const history = await sql`
      SELECT 
        user_message,
        bot_reply,
        created_at
      FROM assistant_conversations
      WHERE customer_id = ${customerId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    res.json({
      success: true,
      history: history.reverse() // Đảo ngược để hiển thị từ cũ đến mới
    });

  } catch (error) {
    console.error('Get Chat History Error:', error);
    res.status(500).json({ 
      error: 'Failed to get chat history' 
    });
  }
}

/**
 * Xóa lịch sử chat (tính năng privacy)
 */
export async function clearChatHistory(req, res) {
  try {
    const { customerId } = req.params;

    await sql`
      DELETE FROM assistant_conversations
      WHERE customer_id = ${customerId}
    `;

    res.json({
      success: true,
      message: 'Chat history cleared'
    });

  } catch (error) {
    console.error('Clear Chat History Error:', error);
    res.status(500).json({ 
      error: 'Failed to clear chat history' 
    });
  }
}
