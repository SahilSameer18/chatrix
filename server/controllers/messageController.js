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
    if (!username?.trim() || !text?.trim() || text.length > 2000) {
      return res.status(400).json({ message: 'Username and text are required (max 2000 chars)' });
    }
    
    const newMessage = await Message.create({
      username: username.trim(),
      text: text.trim(),
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error saving message', error: error.message });
  }
};