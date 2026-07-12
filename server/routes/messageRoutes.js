import express from 'express';
import { getMessages, createMessage } from '../controllers/messageController.js';

const router = express.Router();

// Route to fetch all message logs (chat history)
router.get('/', getMessages);

// Route to send a message via HTTP POST (alternative to WebSocket connection)
router.post('/', createMessage);

export default router;

