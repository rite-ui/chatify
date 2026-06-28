import { useCallback, useRef } from 'react';
import { getSocket } from '../services/socket.js';

export const useTyping = (conversationId) => {
  const isTyping = useRef(false);
  const timeoutRef = useRef(null);

  // 1. Jab user type karna shuru kare (Har keypress par call hoga)
  const startTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;

    // Agar pehle se typing true nahi hai, toh hi emit karo (Network efficiency)
    if (!isTyping.current) {
      isTyping.current = true;
      socket.emit('typing:start', { conversationId });
    }

    // Purane timeout ko clear karke naya 2 second ka timer lagao (Debounce Mechanism)
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isTyping.current = false;
      socket.emit('typing:stop', { conversationId });
    }, 2000);
  }, [conversationId]);

  // 2. Jab message submit ho jaye ya user input field se blur ho jaye
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