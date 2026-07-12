import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '../socket/socketService';
import { fetchChatHistory, loginUser, logoutUser } from '../api/messages';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [username, setUsername] = useState(() => localStorage.getItem('chat_username') || null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to connect and setup listeners
  const connectSocket = (userVal) => {
    if (!socket.connected) {
      socket.connect();
    } else {
      socket.emit('join', userVal);
    }
  };

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const history = await fetchChatHistory();
      setMessages(history);
      setError(null);
    } catch (err) {
      console.error('Failed to load chat history:', err);
      setError('Could not retrieve chat history. Operating offline.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mount/Dismount socket listeners when socket state changes
  useEffect(() => {
    const handleConnect = () => {
      setSocketConnected(true);
      if (username) {
        socket.emit('join', username);
      }
    };
    const handleDisconnect = () => {
      setSocketConnected(false);
    };

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    const handleTyping = ({ username: typingUser, isTyping }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        if (isTyping) {
          next[typingUser] = true;
        } else {
          delete next[typingUser];
        }
        return next;
      });
    };

    const handleMessageError = (err) => {
      setError(err.message);
      // Auto-clear error after 4 seconds
      setTimeout(() => setError(null), 4000);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('online_users', handleOnlineUsers);
    socket.on('typing', handleTyping);
    socket.on('message_error', handleMessageError);

    // If username already stored in localStorage, auto connect
    if (username) {
      connectSocket(username);
      loadHistory();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('online_users', handleOnlineUsers);
      socket.off('typing', handleTyping);
      socket.off('message_error', handleMessageError);
    };
  }, [username]);

  const login = async (userVal) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const loggedUser = await loginUser(userVal);
      const name = loggedUser.username;
      
      localStorage.setItem('chat_username', name);
      setUsername(name);
      
      connectSocket(name);
      await loadHistory();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!username) return;
    try {
      setIsLoading(true);
      await logoutUser(username);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('chat_username');
      setUsername(null);
      setMessages([]);
      setOnlineUsers([]);
      setTypingUsers({});
      socket.disconnect();
      setIsLoading(false);
    }
  };

  const sendMessage = (text) => {
    if (!socket.connected) {
      setError('Connection lost. Reconnecting...');
      socket.connect();
      return;
    }
    socket.emit('send_message', { username, text });
  };

  const emitTyping = (isTyping) => {
    socket.emit('typing', isTyping);
  };

  return (
    <ChatContext.Provider
      value={{
        username,
        messages,
        onlineUsers,
        typingUsers,
        socketConnected,
        isLoading,
        error,
        setError,
        login,
        logout,
        sendMessage,
        emitTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
export default ChatContext;

