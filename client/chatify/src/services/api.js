// Artificial loading state framework handler
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Generates local dummy messages loop
const generateDummyMessages = (_convId) => {
    if (_convId) console.log("Fetching mock messages for node stream:", _convId);
  return [
    { _id: 'm1', sender: 'user_ritesh_123', content: 'Hey bro! Setup kaisa chal raha hai?', createdAt: new Date(Date.now() - 600000).toISOString() },
    { _id: 'm2', sender: 'other_user', content: 'Ekdum makkhan chal raha hai, UI ready hai!', createdAt: new Date(Date.now() - 300000).toISOString() },
    { _id: 'm3', sender: 'user_ritesh_123', content: 'Zustand and Axios pipeline integrated! 🔥', createdAt: new Date().toISOString() },
  ];
};

// ─── Auth Mock Controllers ───────────────────────────────────────────────────
export const authAPI = {
  register: async (data) => {
    await delay(1000);
    return {
      data: {
        token: "dummy_jwt_token_chatify",
        user: { _id: "user_ritesh_123", username: data.username || "Ritesh Dev", email: data.email, bio: "MERN Stack Developer", avatar: null, status: "online" }
      }
    };
  },
  
  login: async (credentials) => {
    await delay(1000);
    return {
      data: {
        token: "dummy_jwt_token_chatify",
        user: { _id: "user_ritesh_123", username: "Ritesh Dev", email: credentials.email || "ritesh@luxe.com", bio: "MERN Stack Developer", avatar: null, status: "online" }
      }
    };
  },

  logout: async () => {
    await delay(500);
    return { data: { success: true } };
  },

  getMe: async () => {
    await delay(600);
    return {
      data: {
        user: { _id: "user_ritesh_123", username: "Ritesh Dev", email: "ritesh@luxe.com", bio: "MERN Stack Developer", avatar: null, status: "online" }
      }
    };
  },

  // ✅ FIXED: Logged parameter execution to pass ESLint checks cleanly
  verifyEmail: async (token) => {
    console.log("Mock verification token packet:", token);
    await delay(500);
    return { data: { success: true, message: "Email validation complete!" } };
  },

  // ✅ FIXED: Bypassed ESLint 'never used' via standard assignment
  forgotPassword: async (email) => {
    console.log("Mock forgot request for:", email);
    await delay(800);
    return { data: { success: true, message: "Reset token dispatched link to email node!" } };
  },

  // ✅ FIXED: Used variables inside logging statement
  resetPassword: async (token, password) => {
    console.log("Resetting with token node:", token, "and credentials:", !!password);
    await delay(1000);
    return { data: { success: true, message: "Password updated successfully!" } };
  },

  updateProfile: async (data) => {
    await delay(800);
    return {
      data: {
        user: { _id: "user_ritesh_123", username: "Ritesh Dev", email: "ritesh@luxe.com", bio: data.bio || "Updated Bio Nodes", avatar: null, status: "online" }
      }
    };
  },
};

// ─── Chat Mock Controllers ───────────────────────────────────────────────────
export const chatAPI = {
  getConversations: async () => {
    await delay(800);
    return {
      data: [
        { _id: 'c1', name: 'Global Tech Group', type: 'group', isGroup: true, status: 'none', lastMessage: { content: 'Zustand and Axios pipeline integrated! 🔥' } },
        { _id: 'c2', name: 'Aman Kumar (Backend)', type: 'direct', isGroup: false, status: 'online', lastMessage: { content: 'Ekdum makkhan chal raha hai, UI ready hai!' } },
        { _id: 'c3', name: 'Vikram Singh', type: 'direct', isGroup: false, status: 'away', lastMessage: { content: 'Bhai deploy kab kar rahe ho?' } }
      ]
    };
  },

  createDirect: async (userId) => {
    console.log("Mock connection payload user:", userId);
    await delay(600);
    return {
      data: { _id: `c_new_${Math.random()}`, name: 'New Direct Connection', type: 'direct', status: 'online' }
    };
  },

  createGroup: async (data) => {
    await delay(900);
    return {
      data: { _id: `c_group_${Math.random()}`, name: data.name || 'Custom Team Build', type: 'group', isGroup: true }
    };
  },

  getMessages: async (id, page = 1) => {
    await delay(500);
    return {
      data: {
        messages: generateDummyMessages(id),
        pagination: { currentPage: page, hasMore: false }
      }
    };
  },

  deleteMessage: async (id) => {
    console.log("Purging message token id:", id);
    await delay(300);
    return { data: { success: true, message: "Message node purged." } };
  },

  searchUsers: async (q) => {
    await delay(400);
    const usersList = [
      { _id: 'u_aman', username: 'Aman Kumar', email: 'aman@test.com' },
      { _id: 'u_vikram', username: 'Vikram Singh', email: 'vikram@test.com' },
      { _id: 'u_rahul', username: 'Rahul Sharma', email: 'rahul@test.com' }
    ];
    const filtered = usersList.filter(u => u.username.toLowerCase().includes(q.toLowerCase()));
    return { data: filtered };
  },
};

// ─── AI Mock Controllers ──────────────────────────────────────────────────────
export const aiAPI = {
  chat: async (data) => {
    console.log("Mock payload routing parsing to vector engine:", data);
    await delay(1200);
    return {
      data: { response: "[AI Assistant]: Vector matrix stream processed. I can help optimize your layout code blocks!" }
    };
  },

  summarize: async (convId) => {
    console.log("Analyzing stream summaries on node:", convId);
    await delay(1500);
    return {
      data: { summary: "Summary: The channel users discussed full-stack deployment setups, verified frontend modularity, and synchronized Zustand auth states." }
    };
  },

  suggestReply: async (convId) => {
    console.log("Generating predictions context stream array for chat:", convId);
    await delay(1000);
    return {
      data: { suggestions: ["Awesome! Let's deploy it right away.", "Sounds good, looking into the bugs now.", "Can you share the server logs?"] }
    };
  },
};

// Fallback baseline client
const api = { defaults: { headers: {} } };
export default api;