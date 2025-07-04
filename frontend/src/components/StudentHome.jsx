import React, { useState } from 'react';

const StudentHome = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Dummy AI response (replace with real AI API call if needed)
  const handleAskAI = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    // Simulate AI response
    setTimeout(() => {
      setResponse(`AI says: "${input}" is a great question!`);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-pink-100 p-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">Ask AI Anything!</h2>
        <form className="w-full flex flex-col items-center gap-4" onSubmit={handleAskAI}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full p-4 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white text-lg"
            placeholder="Type your question for AI..."
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-orange-400 text-white py-3 px-8 rounded-lg font-bold shadow hover:scale-105 transition-transform text-lg"
            disabled={loading}
          >
            {loading ? 'Thinking...' : 'Ask AI'}
          </button>
        </form>
        {response && (
          <div className="mt-6 w-full bg-pink-50 rounded-lg p-4 text-pink-700 text-lg shadow-inner animate-fadeIn">
            {response}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentHome;
