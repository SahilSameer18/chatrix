import User from '../models/user.js';

// @desc    Dummy login (Find or create user)
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const trimmedUsername = username.trim();
    
    // Find or create user
    let user = await User.findOne({ username: trimmedUsername });
    if (!user) {
      user = await User.create({ username: trimmedUsername, isOnline: true });
    } else {
      user.isOnline = true;
      user.lastSeen = new Date();
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// @desc    Dummy logout
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const user = await User.findOne({ username: username.trim() });
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
      await user.save();
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

