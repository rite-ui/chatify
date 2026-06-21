import express from 'express';
import {
  getConversations,
  createOrGetDirectConversation,
  createGroupConversation,
  getMessages,
  deleteMessage,
  searchUsers,
} from '../controllers/chatController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.use(protect);

// Conversations
router.get('/conversations', getConversations);
router.post('/conversations/direct', createOrGetDirectConversation);
router.post('/conversations/group', createGroupConversation);

// Messages
router.get('/messages/:conversationId', getMessages);
router.delete('/messages/:messageId', deleteMessage);

// Users
router.get('/users/search', searchUsers);

export default router;
