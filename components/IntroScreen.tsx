
import React, { useState } from 'react';
import { UserInfo } from '../types';
import { ROBOKI_LOGO_URL } from '../constants';

interface IntroScreenProps {
  onStart: (user: UserInfo) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [school, setSchool] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && className && school) {
      onStart({ name, className, school });
    }
  };

  return (
    <div className="glass-panel rounded-[2rem] shadow-2xl p-8 md:p-12 animate-fade-in mx-auto max-w-md w-full relative overflow-hidden border border-white/60">
      {/* Decorative background elements inside card */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-50"></div>

      <div className="flex flex-col items-center mb-8 relative z-10">
        <div className="relative group">
           <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
           <img 
            src={ROBOKI_LOGO_URL} 
            alt="Roboki" 
            className="w-28 h-28 mb-6 relative z-10 animate-bounce-slow rounded-full shadow-2xl border-4 border-white object-cover" 
          />
        </div>
        
        <h1 className="text-3xl font-black text-slate-800 text-center uppercase mb-2 serif-font tracking-tight">
          Thử Tài <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Văn Học</span>
        </h1>
        <div className="h-1.5 w-16 bg-orange-400 rounded-full mb-3"></div>
        <p className="text-center text-slate-600 font-medium mb-3">
          Cùng Roboki AI chinh phục đỉnh cao tri thức!
        </p>

        {/* Game Info Badge */}
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full px-4 py-1.5 shadow-sm">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <span className="text-blue-500">📚</span> 3 Cấp độ
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <span className="text-orange-500">⚡</span> 5 Câu hỏi/Vòng
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="group">
          <label className="block text-sm font-extrabold text-blue-900 mb-2 uppercase tracking-wide ml-1 drop-shadow-sm">Họ và tên</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 bg-white/90 backdrop-blur-sm shadow-sm group-hover:shadow-md placeholder:font-normal placeholder:text-slate-400 text-lg"
            placeholder="Nhập họ và tên..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-sm font-extrabold text-blue-900 mb-2 uppercase tracking-wide ml-1 drop-shadow-sm">Lớp</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 bg-white/90 backdrop-blur-sm shadow-sm group-hover:shadow-md placeholder:font-normal placeholder:text-slate-400 text-lg"
              placeholder="VD: 12A1"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          <div className="group">
             <label className="block text-sm font-extrabold text-blue-900 mb-2 uppercase tracking-wide ml-1 drop-shadow-sm">Trường</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 bg-white/90 backdrop-blur-sm shadow-sm group-hover:shadow-md placeholder:font-normal placeholder:text-slate-400 text-lg"
              placeholder="Tên trường..."
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/30 transform transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
        >
          <span>BẮT ĐẦU</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </form>
    </div>
  );
};
