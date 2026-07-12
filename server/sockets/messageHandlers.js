import Message from '../models/message.js';

const messageHandlers = (io, socket, activeUsers) => {
  socket.on('send_message', async (data) => {
    try {
      const { username, text } = data;
      if (!username?.trim() || !text?.trim() || text.length > 2000) {
        return socket.emit('message_error', { message: 'Username and text are required (max 2000 chars)' });
      }
      
      // Save message to database
      const savedMessage = await Message.create({
        username: username.trim(),
        text: text.trim(),
      });
      
      // Broadcast message to all connected clients
      io.emit('receive_message', savedMessage);
    } catch (error) {
      console.error('Error saving/broadcasting message:', error.message);
      socket.emit('message_error', { message: 'Failed to send message. Please try again.' });
    }
  });
};

export default messageHandlers;

