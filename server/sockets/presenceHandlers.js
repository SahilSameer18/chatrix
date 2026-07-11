import User from '../models/user.js';

const presenceHandlers = (io, socket, activeUsers) => {
  // Join event - user registers their username
  socket.on('join', async (username) => {
    if (!username) return;

    activeUsers.set(socket.id, username);
    console.log(`User registered: ${username} (${socket.id})`);

    try {
      // Sync online status to database
      await User.findOneAndUpdate(
        { username },
        { isOnline: true, lastSeen: new Date() },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Error updating user presence in DB:', err.message);
    }

    // Broadcast list of unique online users
    io.emit('online_users', Array.from(new Set(activeUsers.values())));
  });

  // Disconnect event
  socket.on('disconnect', async () => {
    const username = activeUsers.get(socket.id);
    if (username) {
      activeUsers.delete(socket.id);
      console.log(`User disconnected: ${username} (${socket.id})`);

      // If the user has no more active socket connections, mark offline in DB
      const isStillConnected = Array.from(activeUsers.values()).includes(username);
      if (!isStillConnected) {
        try {
          await User.findOneAndUpdate(
            { username },
            { isOnline: false, lastSeen: new Date() }
          );
        } catch (err) {
          console.error('Error updating user presence in DB:', err.message);
        }
      }

      // Broadcast updated online list
      io.emit('online_users', Array.from(new Set(activeUsers.values())));
    }
  });
};

export default presenceHandlers;