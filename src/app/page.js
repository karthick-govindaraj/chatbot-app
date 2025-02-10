"use client";
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setChat((prev) => [...prev, { type: 'user', content: message }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      });

      const data = await response.json();
      setChat((prev) => [...prev, { type: 'bot', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setChat((prev) => [
        ...prev,
        { type: 'bot', content: 'Sorry, I encountered an error.' },
      ]);
    }

    setLoading(false);
    setMessage('');
  };

  const handleClearChat = () => {
    setChat([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-6 flex flex-col">
      {/* Header */}
      <header className="text-center py-4">
        <h1 className="text-4xl font-bold text-black animate-bounce">
          Chat with AI
        </h1>
      </header>

      {/* Main Chat Container */}
      <main className="flex-grow container mx-auto px-4 sm:px-0">
        <div className="bg-white shadow-xl rounded-3xl p-6">
          {/* Context Input */}
          <div className="mb-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black"
              rows="3"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Paste your document context here..."
            />
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="chat-container h-80 overflow-y-auto mb-4 p-4 border rounded bg-gray-50"
          >
            {chat.length === 0 ? (
              <p className="text-center text-gray-500">
                Your chat will appear here...
              </p>
            ) : (
              chat.map((entry, index) => (
                <div
                  key={index}
                  className={`mb-4 p-3 rounded transition transform hover:scale-105 text-black ${
                    entry.type === 'user'
                      ? 'bg-blue-100 text-right self-end max-w-[80%]'
                      : 'bg-gray-200 text-left self-start max-w-[80%]'
                  }`}
                >
                  {entry.content}
                </div>
              ))
            )}
          </div>

          {/* Input and Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <form onSubmit={handleSubmit} className="flex flex-grow gap-2 w-full">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black"
                placeholder="Type your message..."
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition disabled:bg-blue-300"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
            <button
              onClick={handleClearChat}
              className="bg-red-500 text-white px-4 py-3 rounded hover:bg-red-600 transition"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4">
        <p className="text-black">
          © 2025 AI Chat Application. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
