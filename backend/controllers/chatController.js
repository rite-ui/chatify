import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';
import User from '../models/user.model.js';

// @GET /api/conversations
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      isArchived: false,
    })
      .populate('participants', 'username avatar status lastSeen')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username avatar' },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

// @POST /api/conversations/direct
export const createOrGetDirectConversation = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot chat with yourself' });
    }

    let conversation = await Conversation.findOne({
      type: 'direct',
      participants: { $all: [req.user._id, userId], $size: 2 },
    }).populate('participants', 'username avatar status lastSeen');

    if (!conversation) {
      conversation = await Conversation.create({
        type: 'direct',
        participants: [req.user._id, userId],
      });
      conversation = await conversation.populate('participants', 'username avatar status lastSeen');
    }

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};

// @POST /api/conversations/group
export const createGroupConversation = async (req, res, next) => {
  try {
    const { name, participants } = req.body;

    if (!name || !participants?.length) {
      return res.status(400).json({ success: false, message: 'Name and participants are required' });
    }

    const allParticipants = [...new Set([...participants, req.user._id.toString()])];

    const conversation = await Conversation.create({
      type: 'group',
      name,
      participants: allParticipants,
      admins: [req.user._id],
      avatar: `https://api.dicebear.com/8.x/shapes/svg?seed=${name}`,
    });

    await conversation.populate('participants', 'username avatar status lastSeen');
    res.status(201).json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};

// @GET /api/messages/:conversationId
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .populate('sender', 'username avatar')
      .populate('replyTo', 'content sender')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ success: true, messages: messages.reverse() });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/messages/:messageId
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findOne({
      _id: req.params.messageId,
      sender: req.user._id,
    });

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.isDeleted = true;
    message.content = 'This message was deleted';
    await message.save();

    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

// @GET /api/users/search
export const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ success: false, message: 'Query must be at least 2 characters' });
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    })
      .select('username email avatar status lastSeen bio')
      .limit(10);

    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
