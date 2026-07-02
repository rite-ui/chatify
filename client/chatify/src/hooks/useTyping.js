import { useCallback, useRef } from 'react';
import { getSocket } from '../services/socket.js';

const useTyping = (conversationId) => {
  const isTyping = useRef(false);
  const timeoutRef = useRef(null);

  const startTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;

    if (!isTyping.current) {
      isTyping.current = true;
      socket.emit('typing:start', { conversationId });
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isTyping.current = false;
      socket.emit('typing:stop', { conversationId });
    }, 2000);
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;
    clearTimeout(timeoutRef.current);
    if (isTyping.current) {
      isTyping.current = false;
      socket.emit('typing:stop', { conversationId });
    }
  }, [conversationId]);

  return { startTyping, stopTyping };
};

export default useTyping;
