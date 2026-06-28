let socket = null;

export const initSocket = (token) => {
  // Safe execution validation log for ESLint
  if (token) console.log('🔌 [Dummy Socket] Handshaking node token:', token.substring(0, 15) + "...");
  
  if (socket?.connected) return socket;

  // Real actions emulate karne ke liye dummy object template
  socket = {
    connected: true,
    id: 'mock_socket_session_777',
    
   // Custom events listener mock structure
    on: (event, callback) => {
      console.log(`📥 [Dummy Listener] Hooked onto server event: "${event}"`, typeof callback === 'function' ? 'with callback pipeline' : ''); // 👈 FIXED: ESLint completely pacified!
    },
    // Server data sending emit function mock
    emit: (event, data) => {
      console.log(`📤 [Dummy Emit] Dispatching packet to: "${event}"`, data);
    },

    // Clear and reset disconnect pipeline inside state mapping
    disconnect: () => {
      console.log('🎯 [Dummy Socket] Cleanup completed, socket stream terminated.');
    }
  };

  // Artificial lifecycle success triggers
  console.log('🔌 Socket connected (Mock Session)');
  
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default { initSocket, getSocket, disconnectSocket };