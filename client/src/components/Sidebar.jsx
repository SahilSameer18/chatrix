import React from 'react';
import { useChat } from '../context/ChatContext';
import { FiLogOut, FiUsers, FiRadio, FiX } from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { username, onlineUsers, socketConnected, logout } = useChat();

  return (
    <>
      {/* Mobile slide-over backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 w-72 md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiRadio className={`text-xl ${socketConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-500'}`} />
            <span className="font-bold text-lg text-slate-100 tracking-wide">Chatrix</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span>{socketConnected ? 'Connected' : 'Offline'}</span>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 md:hidden transition-colors cursor-pointer"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>

        {/* Online Users List */}
        <div className="flex-1 overflow-y-auto scrollbar-custom p-4 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <FiUsers className="text-sm" />
            <span>Online Users ({onlineUsers.length})</span>
          </div>
          
          <div className="space-y-1">
            {onlineUsers.map((user) => (
              <div
                key={user}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  user === username
                    ? 'bg-violet-600/10 border border-violet-500/20 text-violet-300 font-medium'
                    : 'hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="avatar-base">
                      {user.slice(0, 2)}
                    </div>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
                  </div>
                  <span className="truncate">{user} {user === username && '(You)'}</span>
                </div>
              </div>
            ))}
            
            {onlineUsers.length === 0 && (
              <div className="text-xs text-slate-500 text-center py-4">No users online</div>
            )}
          </div>
        </div>

        {/* Profile & Logout Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-sm uppercase text-white shadow-md">
              {username?.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{username}</p>
              <p className="text-xs text-slate-500">Active Session</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
