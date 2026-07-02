import { useEffect } from 'react';
import { getSocket } from '../services/socket.js';
import useChatStore from '../context/chatStore.js';

const useSocket = () => {
  const { addMessage, updateMessage, setTyping, setOnlineUsers, updateUserStatus } = useChatStore();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handlers = {
      'message:new':    (msg)  => addMessage(msg),
      'message:updated':(msg)  => updateMessage(msg),
      'users:online':   (ids)  => setOnlineUsers(ids),
      'user:status':    ({ userId, status }) => updateUserStatus(userId, status),
      'typing:start':   ({ userId, username, conversationId }) =>
                          setTyping(conversationId, userId, username, true),
      'typing:stop':    ({ userId, conversationId }) =>
                          setTyping(conversationId, userId, null, false),
    };

    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));

    return () => {
      Object.keys(handlers).forEach((event) => socket.off(event));
    };
  }, [addMessage, updateMessage, setTyping, setOnlineUsers, updateUserStatus]);
};

export default useSocket;
