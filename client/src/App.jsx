import React from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import LoginView from './components/LoginView';
import ChatDashboard from './components/ChatDashboard';

const ChatAppContent = () => {
  const { username } = useChat();
  return username ? <ChatDashboard /> : <LoginView />;
};

const App = () => {
  return (
    <ChatProvider>
      <ChatAppContent />
    </ChatProvider>
  );
};

export default App;


