
import React, { useState, useEffect, useRef } from 'react';
import { ROBOKI_LOGO_URL } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  isMuted: boolean;
  onToggleMute: () => void;
  xp?: number;
  userName?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, isMuted, onToggleMute, xp = 0, userName }) => {
  const mainRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        // Trigger state when scrolled more than 10px
        setIsScrolled(mainRef.current.scrollTop > 10);
      }
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col h-[100dvh] w-full font-sans overflow-hidden">
      {/* Header Info - Compact Glassmorphism */}
      <header className={`flex-none w-full glass-panel shadow-sm p-2 z-50 flex justify-between items-center gap-2 px-3 md:px-6 transition-all duration-500 relative ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-md py-1' : 'bg-white/70 py-2'}`}>
        {/* Left: Organization Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center transition-all duration-300">
          {/* Organization Name: Balanced, Uppercase, Bold but smaller than Title */}
          <h2 className={`text-[9px] md:text-[11px] font-bold text-slate-500 tracking-wide uppercase truncate transition-all leading-tight ${isScrolled ? 'h-0 opacity-0 mb-0' : 'h-auto opacity-100 mb-0.5'}`}>
            CÔNG TY TNHH TƯ VẤN VÀ PHÁT TRIỂN GIÁO DỤC INNEDU
          </h2>
          
          {/* Contest Name: Prominent, Uppercase, Larger */}
          <h1 className="text-[10px] md:text-[14px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 serif-font leading-tight break-words line-clamp-2 md:line-clamp-none">
            CUỘC THI SÁNG TẠO SẢN PHẨM GIÁO DỤC TRÊN NỀN TẢNG ROBOKI AI
          </h1>
          
          {/* Teacher Info: Mobile only subtitle */}
          <p className={`text-[9px] text-slate-500 md:hidden truncate mt-0.5 transition-all ${isScrolled ? 'h-0 opacity-0' : 'h-auto'}`}>GV: Đặng Thị Bích Hài - THPT Tịnh Biên</p>
        </div>

        {/* Center/Right: Gamification & Controls */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
           
           {/* XP Badge */}
           {userName && (
             <div className="flex items-center gap-1.5 bg-gradient-to-br from-yellow-50 to-amber-100 border border-yellow-300 rounded-full pl-1 pr-3 py-0.5 shadow-sm animate-fade-in group hover:shadow-md transition-all cursor-default">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full p-1 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.964 2.033-1.96 1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] md:text-[9px] text-amber-800 font-bold uppercase tracking-wider opacity-70 hidden md:block">XP</span>
                  <span className="text-sm md:text-lg font-black text-amber-700 font-mono tabular-nums">{xp}</span>
                </div>
             </div>
           )}

           {/* User Info (Compact) */}
           {userName && (
             <div className="hidden md:flex flex-col items-end border-r border-slate-300 pr-4 mr-1">
              <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{userName}</p>
             </div>
           )}

           {/* Mute Toggle */}
           <button
             onClick={onToggleMute}
             className="p-2 rounded-full bg-white/50 hover:bg-white text-slate-600 transition-all shadow-sm border border-slate-200 hover:shadow-md hover:text-blue-600 active:scale-95"
           >
             {isMuted ? (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
               </svg>
             ) : (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 text-blue-600">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
               </svg>
             )}
           </button>
           
           <img 
              src={ROBOKI_LOGO_URL} 
              alt="Logo" 
              className={`w-8 h-8 md:w-12 md:h-12 rounded-full border border-white shadow-md bg-white object-cover ring-1 ring-blue-100 transition-all duration-1000 ease-in-out ${isScrolled ? 'animate-[spin_12s_linear_infinite] scale-90 ring-blue-300' : 'rotate-0'}`} 
           />
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main 
        ref={mainRef as React.RefObject<HTMLDivElement>}
        className="flex-1 w-full overflow-y-auto overflow-x-hidden relative scroll-smooth"
      >
        <div className="min-h-full w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-3 pb-20 md:p-6">
           {children}
        </div>
      </main>

      {/* Footer Branding - Hidden on small mobile screens to save space, visible on tablet/desktop */}
      <footer className="hidden md:block absolute bottom-1 text-center w-full px-4 mix-blend-multiply pointer-events-none">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60">Đặng Thị Bích Hài - THPT Tịnh Biên, An Giang</p>
      </footer>
    </div>
  );
};
