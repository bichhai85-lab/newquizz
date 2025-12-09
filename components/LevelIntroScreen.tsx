
import React from 'react';
import { LevelType } from '../types';
import { LEVEL_INFO } from '../constants';

interface LevelIntroScreenProps {
  level: LevelType;
  onStart: () => void;
}

export const LevelIntroScreen: React.FC<LevelIntroScreenProps> = ({ level, onStart }) => {
  const info = LEVEL_INFO[level];

  // Dynamic Styles based on Level
  const getTheme = () => {
    switch (level) {
      case LevelType.LEVEL_3:
        return {
          bg: "bg-gradient-to-br from-fuchsia-50 to-purple-50",
          border: "border-fuchsia-300",
          iconBg: "bg-fuchsia-100 text-fuchsia-600",
          titleColor: "text-fuchsia-900",
          btnGradient: "from-fuchsia-600 via-purple-600 to-pink-600 hover:from-fuchsia-500 hover:via-purple-500 hover:to-pink-500",
          shadow: "shadow-fuchsia-500/30"
        };
      case LevelType.SPECIAL:
        return {
          bg: "bg-gradient-to-br from-yellow-50 to-orange-50",
          border: "border-yellow-200",
          iconBg: "bg-orange-100 text-orange-600",
          titleColor: "text-red-700",
          btnGradient: "from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500",
          shadow: "shadow-orange-500/20"
        };
      case LevelType.GRADUATION:
        return {
          bg: "bg-gradient-to-br from-cyan-50 to-blue-50",
          border: "border-cyan-200",
          iconBg: "bg-cyan-100 text-cyan-600",
          titleColor: "text-blue-900",
          btnGradient: "from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500",
          shadow: "shadow-cyan-500/20"
        };
      default: // Level 1 & 2
        return {
          bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
          border: "border-blue-200",
          iconBg: "bg-blue-100 text-blue-600",
          titleColor: "text-blue-800",
          btnGradient: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
          shadow: "shadow-blue-500/20"
        };
    }
  };

  const theme = getTheme();

  return (
    <div className={`w-full max-w-lg mx-auto p-8 rounded-[2rem] shadow-2xl animate-scale-in border-4 ${theme.border} ${theme.bg} relative overflow-hidden flex flex-col items-center text-center`}>
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
       <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 ${theme.iconBg}`}></div>

       {/* Icon */}
       <div className={`w-24 h-24 mb-6 rounded-full flex items-center justify-center text-6xl shadow-inner border-4 border-white ${theme.iconBg} relative z-10 animate-bounce-slow`}>
          {info.icon}
       </div>

       {/* Title */}
       <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-wide mb-3 serif-font ${theme.titleColor} relative z-10`}>
         {info.title}
       </h2>

       {/* Separator */}
       <div className="w-16 h-1.5 rounded-full bg-slate-300/50 mb-6"></div>

       {/* Description */}
       <p className="text-slate-600 font-medium text-lg mb-8 leading-relaxed relative z-10">
         {info.desc}
       </p>

       {/* Goal */}
       <div className="mb-8 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/50 inline-block shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Mục tiêu</span>
          <span className={`font-black ${theme.titleColor}`}>5 / 5 Câu</span>
       </div>

       {/* Start Button */}
       <button
         onClick={onStart}
         className={`w-full py-4 bg-gradient-to-r ${theme.btnGradient} text-white font-bold text-xl rounded-2xl shadow-lg ${theme.shadow} transform transition-all hover:scale-105 active:scale-95 border-b-4 border-black/10 active:border-b-0 active:translate-y-1 relative z-10 group`}
       >
         BẮT ĐẦU
         <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
       </button>
    </div>
  );
};
