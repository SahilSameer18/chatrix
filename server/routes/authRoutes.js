import express from 'express';
import { login, logout } from '../controllers/authController.js';

const router = express.Router();

// Route to handle user login (find or create dummy user session)
router.post('/login', login);

// Route to handle user logout (mark user session as offline)
router.post('/logout', logout);

export default router;

