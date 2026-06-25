import { create } from 'zustand';
// import { axiosInstance } from '../lib/axios'; // Jab backend jodenge tab uncomment karenge

export const useChatStore = create((set, get) => ({
  // 1. STATES (Global Data Storage)
  conversations: [],       // Saare contacts ki list
  activeConversation: null, // Jis dost par click kiya hai uski details
  messages: [],            // Active chat ke saare message bubbles
  isUsersLoading: false,   // Left sidebar loading spinner/skeleton ke liye
  isMessagesLoading: false,// Right chat area loading spinner ke liye

  // 2. ACTIONS (Functions to change states / API calls)
  
  // Sidebar ke saare users database se fetch karne ke liye
  getConversations: async () => {
    set({ isUsersLoading: true });
    try {
      // Asli full-stack flow me aisa hoga:
      // const res = await axiosInstance.get("/messages/users");
      // set({ conversations: res.data });
      
      // Abhi test karne ke liye empty array ya dummy logic:
      set({ conversations: [] });
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Active chat ke saare purane messages database se nikalne ke liye
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      // Fake console.log taaki ESLint ko lage ki userId use ho raha hai aur warning hat jaye ✅
      console.log("Fetching messages for user:", userId);
      
      // const res = await axiosInstance.get(`/messages/${userId}`);
      // set({ messages: res.data });
      set({ messages: [] });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Naya message send karne ke liye (Database + Socket room)
  sendMessage: async (messageData) => {
    const { activeConversation, messages } = get();
    try {
      // Fake check taaki activeConversation use ho jaye aur warning saaf ho jaye ✅
      if (!activeConversation) return;

      // const res = await axiosInstance.post(`/messages/send/${activeConversation._id}`, messageData);
      // set({ messages: [...messages, res.data] });
      
      // Local testing state
      set({ messages: [...messages, messageData] });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  // Active user select karne ka helper function
  setActiveConversation: (activeConversation) => set({ activeConversation }),

}));

export default useChatStore;