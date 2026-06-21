import { socketAuth } from '../middleware/authMiddleware.js';
import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';
import User from '../models/user.model.js';

// Track online users: userId -> socketId
const onlineUsers = new Map();

export const initSocket = (io) => {
  io.use(socketAuth);

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    onlineUsers.set(userId, socket.id);

    console.log(`🔌 User connected: ${socket.user.username} (${socket.id})`);

    // Update user status to online
    await User.findByIdAndUpdate(userId, { status: 'online', lastSeen: new Date() });

    // Broadcast online status to all
    socket.broadcast.emit('user:status', { userId, status: 'online' });

    // Join all user's conversation rooms
    const conversations = await Conversation.find({ participants: userId }).select('_id');
    conversations.forEach((conv) => socket.join(conv._id.toString()));

    // Emit current online users to the newly connected user
    socket.emit('users:online', Array.from(onlineUsers.keys()));

    // ─── Send Message ─────────────────────────────────────────────────────────
    socket.on('message:send', async (data, callback) => {
      try {
        const { conversationId, content, replyTo, type = 'text' } = data;

        if (!content?.trim() && type === 'text') {
          return callback?.({ error: 'Message cannot be empty' });
        }

        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: userId,
        });

        if (!conversation) {
          return callback?.({ error: 'Conversation not found' });
        }

        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          content: content.trim(),
          type,
          replyTo: replyTo || null,
        });

        await message.populate('sender', 'username avatar');
        if (replyTo) await message.populate('replyTo', 'content sender');

        // Update last message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          updatedAt: new Date(),
        });

        // Emit to all in conversation
        io.to(conversationId).emit('message:new', message);

        callback?.({ success: true, message });
      } catch (error) {
        console.error('Socket send error:', error);
        callback?.({ error: error.message });
      }
    });

    // ─── Typing Indicators ────────────────────────────────────────────────────
    socket.on('typing:start', ({ conversationId }) => {
      socket.to(conversationId).emit('typing:start', {
        userId,
        username: socket.user.username,
        conversationId,
      });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      socket.to(conversationId).emit('typing:stop', { userId, conversationId });
    });

    // ─── Message Reactions ────────────────────────────────────────────────────
    socket.on('message:react', async ({ messageId, emoji, conversationId }, callback) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return callback?.({ error: 'Message not found' });

        const existingReaction = message.reactions.find((r) => r.emoji === emoji);

        if (existingReaction) {
          const userIndex = existingReaction.users.indexOf(userId);
          if (userIndex > -1) {
            existingReaction.users.splice(userIndex, 1);
            if (existingReaction.users.length === 0) {
              message.reactions = message.reactions.filter((r) => r.emoji !== emoji);
            }
          } else {
            existingReaction.users.push(userId);
          }
        } else {
          message.reactions.push({ emoji, users: [userId] });
        }

        await message.save();
        await message.populate('sender', 'username avatar');

        io.to(conversationId).emit('message:updated', message);
        callback?.({ success: true });
      } catch (error) {
        callback?.({ error: error.message });
      }
    });

    // ─── Read Receipts ────────────────────────────────────────────────────────
    socket.on('message:read', async ({ conversationId }) => {
      try {
        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: userId },
            'readBy.user': { $ne: userId },
          },
          { $push: { readBy: { user: userId, readAt: new Date() } } }
        );

        socket.to(conversationId).emit('message:read', { conversationId, userId });
      } catch (error) {
        console.error('Read receipt error:', error);
      }
    });

    // ─── Edit Message ─────────────────────────────────────────────────────────
    socket.on('message:edit', async ({ messageId, content, conversationId }, callback) => {
      try {
        const message = await Message.findOneAndUpdate(
          { _id: messageId, sender: userId },
          { content: content.trim(), isEdited: true },
          { new: true }
        ).populate('sender', 'username avatar');

        if (!message) return callback?.({ error: 'Message not found' });

        io.to(conversationId).emit('message:updated', message);
        callback?.({ success: true, message });
      } catch (error) {
        callback?.({ error: error.message });
      }
    });

    // ─── Join / Leave Conversation ────────────────────────────────────────────
    socket.on('conversation:join', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('conversation:leave', (conversationId) => {
      socket.leave(conversationId);
    });

    // ─── Disconnect ───────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      onlineUsers.delete(userId);
      console.log(`🔌 User disconnected: ${socket.user.username}`);

      await User.findByIdAndUpdate(userId, {
        status: 'offline',
        lastSeen: new Date(),
      });

      socket.broadcast.emit('user:status', { userId, status: 'offline' });
    });
  });
};

export const getOnlineUsers = () => Array.from(onlineUsers.keys());
