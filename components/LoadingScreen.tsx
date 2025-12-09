import React from 'react';

export const LoadingScreen: React.FC = () => (
    <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center animate-fade-in shadow-xl">
      <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <svg className="w-20 h-20 text-blue-600 animate-bounce-slow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
      </div>
      <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 animate-pulse mb-2">Roboki đang suy nghĩ...</p>
      <p className="text-slate-500 font-medium bg-white/50 px-4 py-1 rounded-full text-sm">Đang soạn câu hỏi mới cho bạn</p>
    </div>
);