import express from 'express';
import { aiChat, summarizeConversation, suggestReply } from '../controllers/aiControllers.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.use(protect);

router.post('/chat', aiChat);
router.get('/summarize/:conversationId', summarizeConversation);
router.get('/suggest-reply/:conversationId', suggestReply);

export default router;
