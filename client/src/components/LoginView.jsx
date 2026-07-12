import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

const LoginView = () => {
  const [inputVal, setInputVal] = useState('');
  const { login, isLoading, error } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    try {
      await login(inputVal);
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-text-primary px-4 relative overflow-hidden">
      {/* Background blobs for depth */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md p-8 rounded-2xl glass-card z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Chatrix
          </h1>
          <p className="mt-2 text-sm text-text-secondary">Enter a username to join the chat</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              disabled={isLoading}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. Alice"
              className="input-base"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="w-full btn-primary block"
          >
            {isLoading ? 'Connecting...' : 'Join Chat'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;



