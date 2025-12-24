import express from 'express';
import { 
  handleChat, 
  getChatHistory, 
  clearChatHistory,
  handleTranscribe
} from '../controllers/assistantController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Chat endpoint
router.post('/chat', handleChat);
router.post('/transcribe', upload.single('audio'), handleTranscribe);

// Get chat history
router.get('/history/:customerId', getChatHistory);

// Clear chat history
router.delete('/history/:customerId', clearChatHistory);

export default router;
