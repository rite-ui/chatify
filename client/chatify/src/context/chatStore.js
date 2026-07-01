import { create } from 'zustand';
import { chatAPI } from '../services/api.js';
import { getSocket } from '../services/socket.js';

const useChatStore = create((set, get) => ({
  conversations:      [],
  activeConversation: null,
  messages:           {},   // conversationId → Message[]
  typingUsers:        {},   // conversationId → { userId, username }[]
  onlineUsers:        [],
  loading:            false,
  msgLoading:         false,

  // ── Conversations ────────────────────────────────────────────────────────────
  fetchConversations: async () => {
    set({ loading: true });
    try {
      const { data } = await chatAPI.getConversations();
      set({ conversations: data.conversations, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  setActiveConversation: (conv) => {
    set({ activeConversation: conv });
    if (conv) {
      const socket = getSocket();
      socket?.emit('conversation:join', conv._id);
      socket?.emit('message:read', { conversationId: conv._id });
    }
  },

  addConversation: (conv) => {
    set((s) => ({
      conversations: [conv, ...s.conversations.filter((c) => c._id !== conv._id)],
    }));
  },

  updateConversationLastMessage: (conversationId, message) => {
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c._id === conversationId ? { ...c, lastMessage: message, updatedAt: new Date() } : c
      ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    }));
  },

  // ── Messages ─────────────────────────────────────────────────────────────────
  fetchMessages: async (conversationId) => {
    set({ msgLoading: true });
    try {
      const { data } = await chatAPI.getMessages(conversationId);
      set((s) => ({
        messages: { ...s.messages, [conversationId]: data.messages },
        msgLoading: false,
      }));
    } catch {
      set({ msgLoading: false });
    }
  },

  addMessage: (message) => {
    const convId = message.conversation;
    set((s) => ({
      messages: {
        ...s.messages,
        [convId]: [...(s.messages[convId] || []), message],
      },
    }));
    get().updateConversationLastMessage(convId, message);
  },

  updateMessage: (message) => {
    const convId = message.conversation;
    set((s) => ({
      messages: {
        ...s.messages,
        [convId]: (s.messages[convId] || []).map((m) =>
          m._id === message._id ? message : m
        ),
      },
    }));
  },

  sendMessage: (conversationId, content, replyTo = null) => {
    const socket = getSocket();
    return new Promise((resolve, reject) => {
      socket?.emit('message:send', { conversationId, content, replyTo }, (res) => {
        if (res?.error) reject(new Error(res.error));
        else resolve(res?.message);
      });
    });
  },

  // ── Typing ───────────────────────────────────────────────────────────────────
  setTyping: (conversationId, userId, username, isTyping) => {
    set((s) => {
      const current = s.typingUsers[conversationId] || [];
      const filtered = current.filter((u) => u.userId !== userId);
      return {
        typingUsers: {
          ...s.typingUsers,
          [conversationId]: isTyping ? [...filtered, { userId, username }] : filtered,
        },
      };
    });
  },

  // ── Online Users ─────────────────────────────────────────────────────────────
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  updateUserStatus: (userId, status) => {
    set((s) => ({
      onlineUsers: status === 'online'
        ? [...new Set([...s.onlineUsers, userId])]
        : s.onlineUsers.filter((id) => id !== userId),
      conversations: s.conversations.map((c) => ({
        ...c,
        participants: c.participants?.map((p) =>
          p._id === userId ? { ...p, status } : p
        ),
      })),
    }));
  },
}));

export default useChatStore;
