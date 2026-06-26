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
    },
    { 
      _id: "conv_3", 
      name: " Group", 
      type: "group",
      participants: [{ _id: "ME" }, { _id: "user_2" }, { _id: "user_3" }],
      lastMessage: { content: "React 19 aur Tailwind v4 rock! 🚀" },
      updatedAt: new Date()
    },
    { 
      _id: "conv_4", 
      name: "Devji Group", 
      type: "group",
      participants: [{ _id: "ME" }, { _id: "user_2" }, { _id: "user_3" }],
      lastMessage: { content: "React 19 aur Tailwind v4 rock! 🚀" },
      updatedAt: new Date()
    }
  ],
  activeConversation: null,
  messages: {},      // conversationId → Message[]
  typingUsers: {},   // conversationId → TypingInfo[]
  onlineUsers: [],
  loading: false,
  msgLoading: false,

  fetchConversations: async () => {
    // Already dummy conversations upar hardcoded hain
  },

  setActiveConversation: (conv) => {
    set({ activeConversation: conv });
    if (conv && !get().messages[conv._id]) {
      // Shuruat me khali array set kar rahe hain taaki error na aaye
      set((s) => ({
        messages: { ...s.messages, [conv._id]: [] }
      }));
    }
  },

  fetchMessages: async (conversationId) => {
    set({ msgLoading: true });
    // Fake loading effect to check your spinner layout
    setTimeout(() => {
      set({ msgLoading: false });
    }, 400);
  },

  updateConversationLastMessage: (conversationId, message) => {
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c._id === conversationId ? { ...c, lastMessage: message, updatedAt: new Date() } : c
      ),
    }));
  },

  // Mock Socket send simulation to keep frontend fully interactive!
  sendMessage: (conversationId, content, replyTo = null) => {
    const newMsg = {
      _id: Date.now().toString(),
      conversation: conversationId,
      content: content,
      type: 'text',
      sender: { _id: "ME", username: "Ritesh Dev" },
      createdAt: new Date().toISOString(),
      readBy: [],
      reactions: [],
      replyTo: replyTo
    };

    set((s) => ({
      messages: {
        ...s.messages,
        [conversationId]: [...(s.messages[conversationId] || []), newMsg],
      },
    }));

    get().updateConversationLastMessage(conversationId, newMsg);
    return Promise.resolve(newMsg);
  },

  setTyping: () => {},
  setOnlineUsers: () => {},
  updateUserStatus: () => {},
}));

export default useChatStore;