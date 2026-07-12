import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

const ChatDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden relative">
      {/* Sidebar drawer and mobile click overlay */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* General messaging console */}
      <ChatArea onToggleSidebar={() => setIsSidebarOpen(true)} />
    </div>
  );
};

export default ChatDashboard;


