import React, { useEffect } from 'react';
import { LevelType } from '../types';
import { SOUNDS } from '../constants';

interface LevelResultScreenProps {
    score: number;
    total: number;
    level: LevelType;
    onNextStage: () => void;
    onRetry: () => void;
    isMuted: boolean;
}

export const LevelResultScreen: React.FC<LevelResultScreenProps> = ({ score, total, level, onNextStage, onRetry, isMuted }) => {
    const isPass = score === total; // Needs 5/5
    
    useEffect(() => {
        if (isPass && !isMuted) {
            const audio = new Audio(SOUNDS.VICTORY_LEVEL);
            audio.volume = 0.8;
            audio.play().catch(e => console.log("Victory sound autoplay prevented", e));
        }
    }, [isPass, isMuted]);
    
    return (
      <div className="glass-panel rounded-[2rem] shadow-2xl p-8 max-w-lg w-full text-center mx-auto border border-white/60 animate-scale-in relative overflow-hidden">
        {isPass && <div className="absolute inset-0 bg-gradient-to-t from-green-50/50 to-transparent pointer-events-none"></div>}
        
        <div className="relative z-10 mb-6">
            <div className="text-8xl mb-4 filter drop-shadow-md animate-bounce-custom">
                {isPass ? '🏆' : '💪'}
            </div>
            <h2 className={`text-4xl font-black mb-2 uppercase tracking-tight ${isPass ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600' : 'text-orange-500'}`}>
                {isPass ? 'HOÀN THÀNH!' : 'CỐ GẮNG LÊN!'}
            </h2>
            <p className="text-slate-600 text-lg font-medium">
                Kết quả: <span className={`font-black text-3xl mx-1 ${isPass ? 'text-green-600' : 'text-orange-500'}`}>{score}/{total}</span> câu
            </p>
        </div>

        {isPass ? (
             <div className="space-y-4 relative z-10">
                 <p className="text-slate-500 italic">Bạn đã hoàn thành xuất sắc cửa này!</p>
                 {level === LevelType.LEVEL_3 ? (
                    <button onClick={onNextStage} className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-400 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/30 transform hover:scale-[1.02] transition-all border-b-4 border-purple-800 active:border-b-0 active:translate-y-1">
                        NHẬN GIẤY CHỨNG NHẬN
                    </button>
                 ) : level === LevelType.SPECIAL ? (
                    <div className="space-y-4">
                         <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl shadow-inner">
                            <h3 className="text-yellow-800 font-bold uppercase text-sm tracking-wider">Danh hiệu đạt được</h3>
                            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">NHÂN TÀI VĂN HỌC</p>
                         </div>
                         <button onClick={onNextStage} className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-2xl shadow-lg shadow-yellow-500/30 transform hover:scale-[1.02] transition-all border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1">
                            VÒNG ĐỈNH CAO TRÍ TUỆ
                        </button>
                    </div>
                 ) : level === LevelType.GRADUATION ? (
                     <div className="space-y-4">
                        <p className="text-blue-800 font-bold">Bạn đã tốt nghiệp xuất sắc!</p>
                         <button onClick={onNextStage} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1">
                            XEM DANH HIỆU THIÊN TÀI
                        </button>
                     </div>
                 ) : (
                    <button onClick={onNextStage} className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transform hover:scale-[1.02] transition-all border-b-4 border-blue-700 active:border-b-0 active:translate-y-1">
                        BƯỚC VÀO {level === LevelType.LEVEL_1 ? 'LEVEL 2' : 'LEVEL 3'}
                    </button>
                 )}
             </div>
        ) : (
            <div className="space-y-4 relative z-10">
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                     <p className="text-red-500 font-bold">Bạn cần trả lời đúng 5/5 câu để qua màn.</p>
                </div>
                <button onClick={onRetry} className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 border-b-4 border-slate-900 active:border-b-0 active:translate-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                    LÀM LẠI BÀI TẬP
                </button>
            </div>
        )}
      </div>
    );
};