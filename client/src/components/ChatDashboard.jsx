import React from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

const ChatDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-950 overflow-hidden">
      {/* Sidebar - renders on the left, collapsible or stacked depending on viewport */}
      <Sidebar />
      
      {/* Chat Area - renders general logs and messaging interface */}
      <ChatArea />
    </div>
  );
};

export default ChatDashboard;
