let socket = null;
const eventHandlers = {};

export const initSocket = (token) => {
  if (token) console.log('🔌 [Dummy Socket] Initialized token node pipeline');
  if (socket?.connected) return socket;

  socket = {
    connected: true,
    id: 'mock_socket_session_777',
    
    on: (event, callback) => {
      eventHandlers[event] = callback;
      console.log(`📥 [Socket.on] Hooked listener onto event: "${event}"`);
    },

    off: (event) => {
      delete eventHandlers[event];
      console.log(`🔌 [Socket.off] Cleaned up event handler for: "${event}"`);
    },

    emit: (event, data) => {
      console.log(`📤 [Socket.emit] Syncing packet data to server channel: "${event}"`, data);
    }
  };

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket = null;
    console.log('🎯 [Dummy Socket] Connections cleanly cleared.');
  }
};

export default { initSocket, getSocket, disconnectSocket };