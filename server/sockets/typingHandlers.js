const typingHandlers = (io, socket, activeUsers) => {
  socket.on('typing', (isTyping) => {
    const username = activeUsers.get(socket.id);
    if (username) {
      // Broadcast typing state to everyone except the sender
      socket.broadcast.emit('typing', { username, isTyping });
    }
  });
};

export default typingHandlers;
