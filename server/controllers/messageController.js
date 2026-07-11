import Message from '../models/message.js';

// @desc    Get all messages (chat history)
// @route   GET /api/messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history', error: error.message });
  }
};

// @desc    Create a new message
// @route   POST /api/messages
export const createMessage = async (req, res) => {
  try {
    const { username, text } = req.body;
    if (!username || !text) {
      return res.status(400).json({ message: 'Username and text are required' });
    }
    const newMessage = await Message.create({ username, text });
    
    // Broadcast message to all connected clients if socket server is attached
    if (req.io) {
      req.io.emit('receive_message', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error saving message', error: error.message });
  }
};
