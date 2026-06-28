import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  // DUMMY DATA FOR SIDEBAR SIMULATION
  conversations: [
    { 
      _id: "conv_1", 
      name: "Aman", 
      type: "dm",
      participants: [{ _id: "ME", username: "Ritesh Dev" }, { _id: "user_1", username: "Aman", status: "online" }],
      lastMessage: { content: "Hello bro, design system kaisa laga?" },
      updatedAt: new Date()
    },
    { 
      _id: "conv_2", 
      name: "Dev Group", 
      type: "group",
      participants: [{ _id: "ME" }, { _id: "user_2" }, { _id: "user_3" }],
      lastMessage: { content: "React 19 aur Tailwind v4 rock! 🚀" },
      updatedAt: new Date()
    }
  ],
  activeConversation: null,
  messages: {},       // conversationId → Message[]
  typingUsers: {},    // conversationId → { userId: username }
  onlineUsers: [],
  loading: false,
  msgLoading: false,

  // ✅ FIXED: Added proper async/sync dummy handler so Sidebar doesn't crash!
  fetchConversations: async () => {
    console.log("📨 Sidebar requested conversations data sync channel...");
    // Local dummy variables already initiated above inside state array.
    return Promise.resolve();
  },

  setActiveConversation: (conv) => {
    set({ activeConversation: conv });
    if (conv && !get().messages[conv._id]) {
      set((s) => ({
        messages: { ...s.messages, [conv._id]: [] }
      }));
    }
  },

  addMessage: (msg) => {
    if (!msg || !msg.conversation) return;
    const convId = msg.conversation;
    set((s) => ({
      messages: { ...s.messages, [convId]: [...(s.messages[convId] || []), msg] }
    }));
    get().updateConversationLastMessage(convId, msg);
  },

  updateMessage: (updatedMsg) => {
    if (!updatedMsg || !updatedMsg.conversation) return;
    const convId = updatedMsg.conversation;
    set((s) => ({
      messages: {
        ...s.messages,
        [convId]: (s.messages[convId] || []).map((m) => m._id === updatedMsg._id ? updatedMsg : m)
      }
    }));
  },

  setOnlineUsers: (ids) => set({ onlineUsers: ids }),
  updateUserStatus: (userId, status) => console.log(`👤 Status synchronization: ${userId} -> ${status}`),

  setTyping: (conversationId, userId, username, isTyping) => {
    set((s) => {
      const currentTyping = { ...(s.typingUsers[conversationId] || {}) };
      if (isTyping && username) {
        currentTyping[userId] = username;
      } else {
        delete currentTyping[userId];
      }
      return { typingUsers: { ...s.typingUsers, [conversationId]: currentTyping } };
    });
  },

  updateConversationLastMessage: (conversationId, message) => {
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c._id === conversationId ? { ...c, lastMessage: message, updatedAt: new Date() } : c
      ),
    }));
  },

  sendMessage: (conversationId, content) => {
    const newMsg = {
      _id: Date.now().toString(),
      conversation: conversationId,
      content: content,
      type: 'text',
      sender: { _id: "ME", username: "Ritesh Dev" },
      createdAt: new Date().toISOString()
    };
    get().addMessage(newMsg);
    return Promise.resolve(newMsg);
  }
}));

export default useChatStore;