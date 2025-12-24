import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

// Khởi tạo AI client (ưu tiên: Gemini > Claude > OpenAI)
let aiClient = null;
let AI_PROVIDER = 'fallback';

if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  AI_PROVIDER = 'gemini';
} else if (process.env.ANTHROPIC_API_KEY) {
  aiClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  AI_PROVIDER = 'anthropic';
} else if (process.env.OPENAI_API_KEY) {
  aiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  AI_PROVIDER = 'openai';
}

// System prompt cho trợ lý mua sắm
const SYSTEM_PROMPT = `Bạn là trợ lý mua sắm thông minh của một ứng dụng thương mại điện tử Việt Nam.

NHIỆM VỤ CỦA BẠN:
- Hỗ trợ người mua (buyer) trong việc tìm kiếm sản phẩm, đặt hàng, theo dõi đơn hàng
- Giải đáp thắc mắc về sản phẩm, giá cả, vận chuyển, thanh toán
- Hướng dẫn sử dụng các tính năng của app
- Tư vấn sản phẩm phù hợp với nhu cầu

NGUYÊN TẮC HOẠT ĐỘNG:
1. Luôn thân thiện, lịch sự và chuyên nghiệp
2. Trả lời ngắn gọn, súc tích (2-3 câu), dễ hiểu
3. Sử dụng emoji phù hợp để tạo sự thân thiện
4. Nếu không biết thông tin, hãy thừa nhận và đề xuất hướng khác
5. Ưu tiên hành động cụ thể (xem đơn hàng, tìm sản phẩm...)
6. Luôn kết thúc bằng câu hỏi để tiếp tục hỗ trợ

CÁC CHỦ ĐỀ CHÍNH:
- 📦 Đơn hàng: Theo dõi, hủy, đổi trả
- 🔍 Sản phẩm: Tìm kiếm, so sánh, đề xuất
- 🛒 Giỏ hàng & Đặt hàng: Hướng dẫn mua hàng
- 💰 Thanh toán: Các phương thức, ví điện tử
- 🚚 Vận chuyển: Thời gian, chi phí, địa chỉ
- ❓ Khác: Tài khoản, chính sách, khuyến mãi

ĐỊNH DẠNG TRẢ LỜI:
- Đoạn ngắn, dễ đọc
- Sử dụng bullet points khi cần liệt kê
- Đề xuất 2-3 gợi ý (suggestions) cho câu hỏi tiếp theo`;

/**
 * Gọi AI để sinh câu trả lời
 */
export async function getAIResponse(message, context = {}) {
  if (!aiClient) {
    return {
      reply: "Xin lỗi, trợ lý AI chưa được cấu hình. Vui lòng liên hệ quản trị viên để được hỗ trợ trực tiếp.",
      suggestions: []
    };
  }

  try {
    // Xây dựng context từ dữ liệu người dùng
    let contextInfo = "";
    
    if (context.recentOrders && context.recentOrders.length > 0) {
      contextInfo += `\n\nĐỒN HÀNG GẦN ĐÂY:\n`;
      context.recentOrders.forEach(order => {
        contextInfo += `- Đơn #${order.id}: ${order.status} - ${order.total_amount}đ\n`;
      });
    }

    if (context.cartItems && context.cartItems.length > 0) {
      contextInfo += `\n\nGIỎ HÀNG HIỆN TẠI: ${context.cartItems.length} sản phẩm\n`;
    }

    // Chuẩn bị conversation history
    const conversationHistory = context.conversationHistory || [];
    
    let aiResponse;

    if (AI_PROVIDER === 'gemini') {
      // Sử dụng Google Gemini
      const model = aiClient.getGenerativeModel({ model: "gemini-pro" });
      
      // Build conversation history for Gemini
      let prompt = SYSTEM_PROMPT + contextInfo + "\n\n";
      
      if (conversationHistory.length > 0) {
        prompt += "Lịch sử hội thoại:\n";
        conversationHistory.forEach(msg => {
          prompt += `${msg.role === 'user' ? 'Người dùng' : 'Trợ lý'}: ${msg.content}\n`;
        });
        prompt += "\n";
      }
      
      prompt += `Người dùng: ${message}\nTrợ lý:`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      aiResponse = response.text();
      
    } else if (AI_PROVIDER === 'anthropic') {
      // Sử dụng Claude
      const response = await aiClient.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        system: SYSTEM_PROMPT + contextInfo,
        messages: [
          ...conversationHistory,
          { role: "user", content: message }
        ]
      });
      
      aiResponse = response.content[0].text;
      
    } else if (AI_PROVIDER === 'openai') {
      // Sử dụng OpenAI
      const response = await aiClient.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 500,
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextInfo },
          ...conversationHistory,
          { role: "user", content: message }
        ]
      });
      
      aiResponse = response.choices[0].message.content;
    }

    // Sinh suggestions dựa trên nội dung
    const suggestions = generateSuggestions(message, aiResponse);

    return {
      reply: aiResponse.trim(),
      suggestions
    };

  } catch (error) {
    console.error("AI Service Error:", error);
    
    // Fallback responses
    return getFallbackResponse(message);
  }
}

/**
 * Transcribe audio buffer -> text (OpenAI Whisper nếu có)
 */
export async function transcribeAudioBuffer(file) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for transcription');
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // Node 20 có hỗ trợ File/Blob
  const audioFile = new File([file.buffer], file.originalname || 'audio.m4a', { type: file.mimetype || 'audio/m4a' });

  const response = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
  });

  return response.text || '';
}

/**
 * Sinh gợi ý câu hỏi tiếp theo
 */
function generateSuggestions(userMessage, aiResponse) {
  const lowerMessage = userMessage.toLowerCase();
  const lowerResponse = aiResponse.toLowerCase();

  // Suggestions dựa trên chủ đề
  if (lowerMessage.includes('đơn hàng') || lowerMessage.includes('order')) {
    return ['Kiểm tra đơn hàng', 'Hủy đơn hàng', 'Đổi địa chỉ giao hàng'];
  }
  
  if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('tìm')) {
    return ['Xem sản phẩm hot', 'Xem khuyến mãi', 'So sánh giá'];
  }
  
  if (lowerMessage.includes('đặt hàng') || lowerMessage.includes('mua')) {
    return ['Thêm vào giỏ', 'Thanh toán ngay', 'Xem phí ship'];
  }
  
  if (lowerMessage.includes('thanh toán') || lowerMessage.includes('payment')) {
    return ['Các phương thức thanh toán', 'Nạp ví', 'Hoàn tiền'];
  }

  // Default suggestions
  return ['Đơn hàng của tôi', 'Tìm sản phẩm', 'Cần hỗ trợ khác'];
}

/**
 * Trả lời fallback khi AI không khả dụng
 */
function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Responses dựa trên từ khóa
  if (lowerMessage.includes('đơn hàng') || lowerMessage.includes('order')) {
    return {
      reply: "📦 Để kiểm tra đơn hàng của bạn:\n\n1. Vào tab 'Đơn hàng' trên trang chủ\n2. Xem chi tiết từng đơn\n3. Theo dõi tình trạng giao hàng\n\nBạn muốn xem đơn hàng nào cụ thể không?",
      suggestions: ['Đơn hàng gần nhất', 'Đơn đang giao', 'Đơn đã hủy']
    };
  }
  
  if (lowerMessage.includes('đặt') || lowerMessage.includes('mua')) {
    return {
      reply: "🛒 Để đặt hàng:\n\n1. Tìm sản phẩm bạn muốn\n2. Thêm vào giỏ hàng\n3. Chọn địa chỉ giao hàng\n4. Chọn phương thức thanh toán\n5. Xác nhận đơn hàng\n\nTôi có thể giúp bạn tìm sản phẩm không?",
      suggestions: ['Xem sản phẩm hot', 'Xem giỏ hàng', 'Thay đổi địa chỉ']
    };
  }
  
  if (lowerMessage.includes('thanh toán') || lowerMessage.includes('payment')) {
    return {
      reply: "💰 Các phương thức thanh toán:\n\n• COD (tiền mặt)\n• Ví điện tử\n• Chuyển khoản\n• Thẻ tín dụng\n\nBạn muốn biết thêm về phương thức nào?",
      suggestions: ['Thanh toán COD', 'Nạp ví', 'Liên kết thẻ']
    };
  }
  
  // Default response
  return {
    reply: "Xin chào! 👋 Tôi có thể giúp bạn:\n\n📦 Kiểm tra đơn hàng\n🔍 Tìm sản phẩm\n🛒 Hướng dẫn đặt hàng\n💰 Thanh toán\n\nBạn cần hỗ trợ gì nhé?",
    suggestions: ['Đơn hàng của tôi', 'Tìm sản phẩm', 'Cách đặt hàng']
  };
}
