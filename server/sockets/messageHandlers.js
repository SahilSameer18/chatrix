import Message from '../models/message.js';

const messageHandlers = (io, socket, activeUsers) => {
  socket.on('send_message', async (data) => {
    try {
      const { username, text } = data;
      if (username && text) {
        // Save message to database
        const savedMessage = await Message.create({ username, text });
        
        // Broadcast message to all connected clients
        io.emit('receive_message', savedMessage);
      }
    } catch (error) {
      console.error('Error saving/broadcasting message:', error.message);
    }
  });
};

export default messageHandlers;

