import messageHandlers from './messageHandlers.js';
import presenceHandlers from './presenceHandlers.js';
import typingHandlers from './typingHandlers.js';

// Map to track active users (socket.id -> username)
const activeUsers = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register modular handlers
    presenceHandlers(io, socket, activeUsers);
    messageHandlers(io, socket, activeUsers);
    typingHandlers(io, socket, activeUsers);
  });
};

export default socketHandler;


