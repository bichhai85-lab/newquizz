
import React from 'react';
import { UserInfo, LevelType } from '../types';
import { LEVEL_INFO } from '../constants';

interface RoadmapScreenProps {
  user: UserInfo;
  xp: number;
  completionCount: number;
  onContinue: () => void;
}

export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({ user, xp, completionCount, onContinue }) => {
  const isSpecialUnlocked = completionCount >= 9;
  const runsRemaining = Math.max(0, 9 - completionCount);
  // Show hint if user is close (needs 1 or 2 more runs)
  const showUnlockHint = !isSpecialUnlocked && runsRemaining <= 2 && runsRemaining > 0;

  const renderLevelCard = (level: LevelType, isLocked: boolean, isNext: boolean, customLabel?: string) => {
    const info = LEVEL_INFO[level];
    
    // Determine visuals based on state
    let cardClass = "relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-2 ";
    if (isLocked) {
      cardClass += "bg-slate-50 border-slate-200 opacity-60 grayscale";
    } else if (isNext) {
      cardClass += "bg-white border-blue-400 shadow-lg scale-105 ring-4 ring-blue-100 z-10";
    } else {
      cardClass += "bg-white border-slate-200 shadow-sm";
    }

    // Theme coloring override for Special/Graduation
    if (!isLocked && level === LevelType.SPECIAL) {
      cardClass = "relative p-4 rounded-2xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg scale-105 z-10 animate-pulse-slow";
    } else if (!isLocked && level === LevelType.GRADUATION) {
       cardClass = "relative p-4 rounded-2xl border-2 border-cyan-400 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-lg scale-105 z-10";
    }

    return (
      <div className={cardClass}>
        {/* Status Badge */}
        <div className="flex justify-between items-start">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm border ${isLocked ? 'bg-slate-200 border-slate-300' : 'bg-white border-slate-100'}`}>
             {info.icon}
           </div>
           {isLocked && <span className="text-xs font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded">Khóa</span>}
           {isNext && <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded animate-pulse">Tiếp theo</span>}
        </div>

        {/* Title */}
        <div>
           <h3 className={`font-bold text-sm md:text-base leading-tight ${isLocked ? 'text-slate-500' : 'text-slate-800'}`}>
             {customLabel || info.title.split(': ')[1] || info.title}
           </h3>
           <p className="text-[10px] md:text-xs text-slate-500 line-clamp-2 mt-1">{info.desc}</p>
        </div>

        {/* 5-Segment Progress Bar Visual */}
        <div className="mt-auto pt-2">
            <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${isLocked ? 'bg-slate-200' : (isNext ? 'bg-blue-200' : 'bg-green-200')}`}></div>
                ))}
            </div>
            <p className="text-[9px] text-right text-slate-400 mt-1 font-medium">5 câu hỏi</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full animate-fade-in pb-12">
      
      {/* Header Info */}
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-2xl md:text-4xl font-black text-slate-800 uppercase serif-font mb-2">Lộ Trình Chinh Phục</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-slate-600 font-medium">
           <p>Xin chào, <span className="text-blue-700 font-bold">{user.name}</span>!</p>
           
           {/* XP Badge */}
           <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              <span className="text-amber-500 text-lg">★</span>
              <span className="font-black text-amber-800">{xp} XP</span>
           </div>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mt-2 italic">Mỗi vòng thi gồm 5 câu hỏi trắc nghiệm</p>
      </div>

      {/* Map Layout */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Connecting Lines (Desktop only usually, simpler stack on mobile) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 rounded"></div>

            {/* Level 1 */}
            <div onClick={onContinue} className="cursor-pointer hover:transform hover:-translate-y-1 transition-transform">
               {renderLevelCard(LevelType.LEVEL_1, false, true)}
            </div>

            {/* Level 2 */}
            <div className="opacity-70">
               {renderLevelCard(LevelType.LEVEL_2, true, false)}
            </div>

             {/* Level 3 */}
            <div className="opacity-70 relative">
               {renderLevelCard(LevelType.LEVEL_3, true, false)}
               
               {/* Unlock Hint Tooltip */}
               {showUnlockHint && (
                   <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs p-2 rounded-lg shadow-lg whitespace-nowrap z-20 animate-bounce">
                      Hoàn thành {runsRemaining} lần nữa để mở khóa Nhân Tài!
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-yellow-100 border-r border-b border-yellow-300"></div>
                   </div>
               )}
            </div>
         </div>

         {/* Special & Graduation Section */}
         <div className="mt-12 md:mt-16 border-t-2 border-dashed border-slate-200 pt-8 relative">
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Vòng Danh Dự</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                 {/* Special Level */}
                 <div className={`${isSpecialUnlocked ? 'cursor-pointer' : ''}`}>
                    {renderLevelCard(LevelType.SPECIAL, !isSpecialUnlocked, false, "THỬ THÁCH ĐẶC BIỆT")}
                 </div>

                 {/* Graduation Level */}
                 <div>
                    {renderLevelCard(LevelType.GRADUATION, true, false, "VÒNG ĐỈNH CAO TRÍ TUỆ")}
                 </div>
            </div>
         </div>
      </div>

      {/* Start Button */}
      <div className="mt-8 flex justify-center">
        <button 
          onClick={onContinue}
          className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl rounded-full shadow-xl shadow-blue-500/40 animate-pulse hover:animate-none transform transition-all hover:scale-105 active:scale-95"
        >
           BẮT ĐẦU CHINH PHỤC
        </button>
      </div>
    </div>
  );
};
