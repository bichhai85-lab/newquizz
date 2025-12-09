
import React, { useEffect } from 'react';
import { UserInfo, LevelType, CertificateRank } from '../types';
import { ROBOKI_LOGO_URL, SOUNDS } from '../constants';
import confetti from 'canvas-confetti';

interface CertificateScreenProps {
  user: UserInfo;
  rank: string;
  xp: number;
  currentLevel: LevelType;
  completionCount: number;
  onStartSpecial: () => void;
  onRestart: () => void;
  isMuted: boolean;
}

export const CertificateScreen: React.FC<CertificateScreenProps> = ({ 
  user, 
  rank, 
  xp,
  currentLevel, 
  completionCount, 
  onStartSpecial, 
  onRestart, 
  isMuted 
}) => {
    
    // Trigger confetti and sound effect on mount
    useEffect(() => {
        if (!isMuted) {
             const audio = new Audio(SOUNDS.CERTIFICATE_SOUND);
             audio.volume = 1.0;
             audio.play().catch(() => {});
        }
        
        // Massive confetti for certificate
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FFD700', '#F0E68C', '#B8860B'] // Gold colors
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
             colors: ['#FFD700', '#F0E68C', '#B8860B']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
    }, [isMuted]);

    // Define helper checks
    const isXuatSacOrHigher = completionCount >= 9 || rank === CertificateRank.XUAT_SAC || rank === CertificateRank.NHAN_TAI || rank === CertificateRank.THIEN_TAI;
    const isDat = rank === CertificateRank.DAT;
    const isIntermediate = (rank === CertificateRank.KHA || rank === CertificateRank.GIOI);

    // Calculate Next Rank Info
    const getNextRankInfo = (count: number) => {
        if (count < 3) return { remaining: 3 - count, nextRank: CertificateRank.KHA };
        if (count < 6) return { remaining: 6 - count, nextRank: CertificateRank.GIOI };
        if (count < 9) return { remaining: 9 - count, nextRank: CertificateRank.XUAT_SAC };
        return null; // Maxed out core ranks
    };

    const nextRankInfo = getNextRankInfo(completionCount);

    // Module: GenerateCertificateTitle_Modern
    const getCertificateTitle = () => {
        // Priority for special levels
        if (currentLevel === LevelType.SPECIAL) return "CHỨNG NHẬN NHÂN TÀI VĂN HỌC";
        if (currentLevel === LevelType.GRADUATION) return "CHỨNG NHẬN THIÊN TÀI VĂN HỌC";

        // Logic based on Level 3 Wins (completionCount)
        if (completionCount >= 9) return "HUY CHƯƠNG KIM CƯƠNG";
        if (completionCount >= 6) return "NHÀ VÔ ĐỊCH HỌC TẬP";
        if (completionCount >= 3) return "CHUỖI CHIẾN THẮNG";
        if (completionCount >= 1) return "MỞ KHÓA THÀNH TÍCH";
        
        // Default fallback
        return "CUỘC THI SÁNG TẠO SẢN PHẨM GIÁO DỤC TRÊN NỀN TẢNG ROBOKI";
    };

    const certificateTitle = getCertificateTitle();

    return (
      <div className="max-w-2xl w-full mx-auto animate-fade-in flex flex-col gap-6 pb-20">
        {/* Certificate Card */}
        <div className="relative bg-[#fffdf5] rounded-xl shadow-2xl p-2 overflow-hidden border-8 border-double border-[#b48d52]">
             {/* Texture & Ornaments */}
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60 pointer-events-none z-0"></div>
             
             {/* Corner Ornaments */}
             <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-[#b48d52] rounded-tl-3xl z-10 m-2"></div>
             <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-[#b48d52] rounded-tr-3xl z-10 m-2"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-[#b48d52] rounded-bl-3xl z-10 m-2"></div>
             <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-[#b48d52] rounded-br-3xl z-10 m-2"></div>

             {/* Roboki Logo Top Right */}
             <div className="absolute top-5 right-5 z-20 flex flex-col items-center">
                 <img 
                    src={ROBOKI_LOGO_URL} 
                    alt="Roboki" 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#b48d52] shadow-sm bg-white object-cover" 
                 />
                 <span className="text-[9px] md:text-[10px] font-black text-[#b48d52] mt-0.5 tracking-wider">ROBOKI AI</span>
             </div>

             <div className="relative z-10 border-2 border-[#b48d52]/30 h-full p-6 md:p-10 flex flex-col items-center text-center">
                
                <h1 className="text-2xl md:text-5xl font-black text-[#85603f] uppercase tracking-widest serif-font mb-2 drop-shadow-sm mt-4 leading-tight">
                    THỬ TÀI VĂN HỌC
                </h1>
                <p className="text-[#85603f] font-serif italic mb-8">Trân trọng trao tặng danh hiệu này cho</p>
                
                <h2 className="text-4xl md:text-5xl font-black text-[#d32f2f] serif-font mb-2 font-cursive" style={{fontFamily: 'serif'}}>
                    {user.name}
                </h2>
                <p className="text-xl font-bold text-slate-700 mb-8">{user.className} - {user.school}</p>

                <div className="w-full h-px bg-[#b48d52] mb-6 relative">
                    <div className="absolute left-1/2 -top-3 transform -translate-x-1/2 bg-[#fffdf5] px-4 text-[#b48d52]">✦</div>
                </div>

                <p className="text-slate-700 text-lg mb-2">Đã hoàn thành xuất sắc và đạt cột mốc</p>
                
                {/* Dynamic Title based on Win Count */}
                <h3 className="text-2xl md:text-3xl font-black text-[#1e3a8a] uppercase mb-8 leading-tight max-w-lg mx-auto">
                    {certificateTitle}
                </h3>

                {/* Stats Grid: Rank & XP */}
                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 mb-8 relative">
                     <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-10"></div>
                     
                     {/* Rank Badge */}
                     <div className="relative flex-1 w-full md:w-auto bg-gradient-to-br from-yellow-100 to-amber-200 border-2 border-amber-400 px-4 py-3 rounded-2xl shadow-lg flex flex-col items-center justify-center min-w-[140px]">
                        <span className="block text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">Xếp loại</span>
                        <span className="block text-xl md:text-2xl font-black text-[#b91c1c] whitespace-nowrap">{rank}</span>
                     </div>

                     {/* XP Badge */}
                     <div className="relative flex-1 w-full md:w-auto bg-gradient-to-br from-blue-100 to-cyan-200 border-2 border-cyan-400 px-4 py-3 rounded-2xl shadow-lg flex flex-col items-center justify-center min-w-[140px]">
                        <span className="block text-[10px] font-bold text-cyan-800 uppercase tracking-widest mb-1">Điểm Tích Lũy</span>
                        <div className="flex items-center gap-1">
                             <span className="text-amber-500 text-lg">★</span>
                             <span className="block text-xl md:text-2xl font-black text-[#1e3a8a]">{xp} XP</span>
                        </div>
                     </div>
                </div>

                {/* Footer Signature Section */}
                <div className="flex justify-between items-end w-full mt-auto pt-4 text-xs md:text-sm text-[#85603f]">
                    {/* Bottom Left: Logo + Auto Confirm */}
                    <div className="flex flex-col items-center">
                         <img 
                            src="https://github.com/bichhai85-lab/Logo/blob/main/logo%20tro%20choi.jpg?raw=true" 
                            alt="Game Logo" 
                            className="w-16 h-16 rounded-full border-2 border-[#b48d52] object-cover shadow-sm mb-2" 
                         />
                         <div className="border-t border-[#b48d52] pt-1 w-full text-center font-bold uppercase tracking-wider text-[10px]">Xác nhận tự động</div>
                    </div>

                    {/* Bottom Right: Teacher Info */}
                    <div className="text-center">
                         <div className="mb-2">An Giang, {new Date().toLocaleDateString('vi-VN')}</div>
                         <div className="font-bold uppercase font-serif text-base mb-1">Đặng Thị Bích Hài</div>
                         <div className="border-t border-[#b48d52] pt-1">Giáo viên phụ trách</div>
                    </div>
                </div>
             </div>
        </div>
        
        {/* ACTION BUTTONS BELOW CERTIFICATE */}
        
        {/* Case 1: XUAT SAC -> Invite to SPECIAL */}
        {currentLevel === LevelType.LEVEL_3 && isXuatSacOrHigher && (
            <div className="flex flex-col gap-3 relative z-20 animate-slide-up">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white shadow-sm text-center">
                     <p className="text-blue-900 font-semibold mb-3">Bạn đã đạt danh hiệu Xuất Sắc! Hãy thử thách bản thân để trở thành Nhân Tài!</p>
                     <button onClick={onStartSpecial} className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg transform hover:scale-[1.01] transition-all uppercase tracking-wide border-b-4 border-rose-800 active:border-b-0 active:translate-y-1">
                        BƯỚC VÀO THỬ THÁCH ĐẶC BIỆT
                    </button>
                </div>
                 <button onClick={onRestart} className="w-full py-3 text-slate-500 hover:text-slate-800 font-semibold">
                    Quay lại làm bài tích điểm thêm
                </button>
            </div>
        )}

        {/* Case 2: Rank DAT (First completions) -> Encourage Replay explicitly */}
        {currentLevel === LevelType.LEVEL_3 && isDat && (
             <div className="flex flex-col gap-3 relative z-20 animate-slide-up">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white shadow-sm text-center">
                     <p className="text-blue-900 font-bold mb-1 px-2 text-lg">
                        Chúc mừng bạn đã hoàn thành lần đầu! 
                     </p>
                     {nextRankInfo && (
                        <p className="text-orange-600 font-semibold mb-3 px-2">
                           Hãy hoàn thành <span className="font-black text-xl">{nextRankInfo.remaining}</span> lần nữa để nâng hạng lên <span className="font-black uppercase">{nextRankInfo.nextRank}</span> và tích lũy thêm điểm XP.
                        </p>
                     )}
                     <button onClick={onRestart} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transform hover:scale-[1.01] transition-all uppercase tracking-wide border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Làm lại để nâng hạng & Tích điểm
                    </button>
                </div>
            </div>
        )}

        {/* Case 3: Rank KHA/GIOI (Intermediate) -> Show progress */}
        {currentLevel === LevelType.LEVEL_3 && isIntermediate && (
             <div className="flex flex-col gap-3 relative z-20 animate-slide-up">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white shadow-sm text-center">
                     {nextRankInfo ? (
                        <p className="text-blue-900 font-semibold mb-2 px-2 text-lg">
                           Bạn đang làm rất tốt! Chỉ cần hoàn thành <span className="font-black text-orange-600 text-xl">{nextRankInfo.remaining}</span> lần nữa để đạt danh hiệu <span className="font-black uppercase text-orange-600">{nextRankInfo.nextRank}</span>.
                        </p>
                     ) : (
                        <p className="text-blue-900 font-semibold mb-2 px-2">
                           Bạn đã rất gần với danh hiệu Xuất Sắc và Thử Thách Đặc Biệt!
                        </p>
                     )}
                     <button onClick={onRestart} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transform hover:scale-[1.01] transition-all uppercase tracking-wide border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2">
                        Tiếp tục làm bài nâng hạng
                    </button>
                </div>
            </div>
        )}

        {/* Case 4: Finished GRADUATION -> Total Victory */}
        {currentLevel === LevelType.GRADUATION && (
            <div className="flex flex-col gap-3 relative z-20 animate-slide-up mt-2">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white shadow-sm text-center">
                     <p className="text-blue-900 font-semibold mb-3">Chúc mừng THIÊN TÀI VĂN HỌC! Hãy tiếp tục rèn luyện nhé!</p>
                     <button onClick={onRestart} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transform hover:scale-[1.01] transition-all uppercase tracking-wide border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        QUAY LẠI TÍCH ĐIỂM XP
                    </button>
                </div>
            </div>
        )}
      </div>
    );
};
