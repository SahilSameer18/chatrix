import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { FiSend, FiMessageSquare, FiMenu } from 'react-icons/fi';

const ChatArea = ({ onToggleSidebar }) => {
  const { username, messages, typingUsers, sendMessage, emitTyping } = useChat();
  const [text, setText] = useState('');
  const [isCurrentlyTyping, setIsCurrentlyTyping] = useState(false);
  
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message submission
  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    sendMessage(text);
    setText('');
    
    // Stop typing state immediately on send
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    emitTyping(false);
    setIsCurrentlyTyping(false);
  };

  // Handle typing state throttling
  const handleInputChange = (e) => {
    setText(e.target.value);

    // If not already marked as typing, emit and set state
    if (!isCurrentlyTyping) {
      setIsCurrentlyTyping(true);
      emitTyping(true);
    }

    // Reset typing timer on activity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
      setIsCurrentlyTyping(false);
    }, 1500); // 1.5s idle threshold
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Format typing users list
  const getTypingText = () => {
    const activeTyping = Object.keys(typingUsers).filter((user) => user !== username);
    if (activeTyping.length === 0) return null;
    if (activeTyping.length === 1) return `${activeTyping[0]} is typing...`;
    if (activeTyping.length === 2) return `${activeTyping[0]} and ${activeTyping[1]} are typing...`;
    return 'Multiple users are typing...';
  };

  const typingText = getTypingText();

  // Helper for message timestamp formatting
  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-bg text-text-primary overflow-hidden">
      {/* Chat Area Header */}
      <div className="p-4 border-b border-white/5 bg-surface/40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface md:hidden transition-colors cursor-pointer"
          >
            <FiMenu className="text-xl" />
          </button>
          
          <div>
            <h2 className="font-bold text-text-primary font-display flex items-center space-x-2">
              <span className="text-primary">#</span>
              <span>general-chat</span>
            </h2>
            <div className="h-4 mt-0.5">
              {typingText && (
                <p className="text-xs text-primary/90 italic animate-pulse">
                  {typingText}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto scrollbar-custom p-4 space-y-4">
        {messages.map((msg, index) => {
          const isOwnMessage = msg.username === username;
          return (
            <div
              key={msg._id || index}
              className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
            >
              {/* Sender name for received messages */}
              {!isOwnMessage && (
                <span className="text-xs font-semibold text-text-secondary mb-1 ml-1">
                  {msg.username}
                </span>
              )}
              
              <div className="flex items-end space-x-2 max-w-[75%]">
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isOwnMessage
                      ? 'bg-gradient-to-r from-primary to-secondary text-bg rounded-tr-none font-bold shadow-md shadow-primary/10'
                      : 'bg-surface border border-white/5 text-text-primary rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <div className={`text-[10px] mt-1 text-right ${isOwnMessage ? 'text-bg/75' : 'text-text-muted'}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary space-y-3">
            <div className="p-4 bg-surface border border-white/5 rounded-full text-2xl text-text-secondary">
              <FiMessageSquare />
            </div>
            <p className="text-sm">No messages yet. Send a message to start the conversation!</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Console */}
      <div className="p-4 border-t border-white/5 bg-surface/20">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 input-base"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-3 btn-primary flex items-center justify-center"
          >
            <FiSend className="text-base" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
