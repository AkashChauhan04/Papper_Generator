import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const options = [
    {
      label: 'Add Questions',
      description: 'Create and add new questions to your database.',
      icon: (
        <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
      ),
      onClick: () => navigate('/add-question'),
    },
    {
      label: 'Generate Paper',
      description: 'Automatically generate a question paper by criteria.',
      icon: (
        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      ),
      onClick: () => navigate('/generate-paper'),
    },
    {
      label: 'Show Questions',
      description: 'View, edit, or delete existing questions.',
      icon: (
        <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      onClick: () => navigate('/show-questions'),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={opt.onClick}
            className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl border-2 border-pink-100 hover:border-pink-300 hover:shadow-pink-200 transition-all duration-300 p-8 group"
          >
            <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
              {opt.icon}
            </div>
            <span className="text-2xl font-bold text-pink-700 mb-2 group-hover:text-orange-500 transition-colors duration-300">{opt.label}</span>
            <span className="text-gray-500 text-center">{opt.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
