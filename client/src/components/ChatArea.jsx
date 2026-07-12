import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { FiSend, FiMessageSquare } from 'react-icons/fi';

const ChatArea = () => {
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
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Chat Area Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-100 flex items-center space-x-2">
            <span className="text-violet-400">#</span>
            <span>general-chat</span>
          </h2>
          <div className="h-4 mt-0.5">
            {typingText && (
              <p className="text-xs text-violet-400/90 italic animate-pulse">
                {typingText}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isOwnMessage = msg.username === username;
          return (
            <div
              key={msg._id || index}
              className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
            >
              {/* Sender name for received messages */}
              {!isOwnMessage && (
                <span className="text-xs font-semibold text-slate-400 mb-1 ml-1">
                  {msg.username}
                </span>
              )}
              
              <div className="flex items-end space-x-2 max-w-[75%]">
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isOwnMessage
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/10'
                      : 'bg-slate-900 border border-slate-800/80 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <div className={`text-[10px] mt-1 text-right ${isOwnMessage ? 'text-violet-200' : 'text-slate-500'}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-full text-2xl text-slate-400">
              <FiMessageSquare />
            </div>
            <p className="text-sm">No messages yet. Send a message to start the conversation!</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Console */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/20">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800/85 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm text-slate-200 placeholder-slate-500 transition-all"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-md shadow-indigo-600/15 transition-all cursor-pointer flex items-center justify-center"
          >
            <FiSend className="text-base" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
