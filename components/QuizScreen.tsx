
import React, { useState, useEffect, useRef } from 'react';
import { Question, LevelType } from '../types';
import { ROBOKI_LOGO_URL, SOUNDS } from '../constants';
import confetti from 'canvas-confetti';

interface QuizScreenProps {
  level: LevelType;
  questions: Question[];
  questionIndex: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  userStreak: number;
  isMuted: boolean;
  volumeSettings: { correct: number, wrong: number };
  onUpdateVolume: (settings: { correct: number, wrong: number }) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ 
  level, 
  questions, 
  questionIndex, 
  onAnswer, 
  onNext, 
  userStreak, 
  isMuted,
  volumeSettings,
  onUpdateVolume
}) => {
  const currentQuestion = questions[questionIndex];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showVolumeControls, setShowVolumeControls] = useState(false);
  
  // Audio refs for layered sound
  const correctMainAudio = useRef<HTMLAudioElement | null>(null);
  const correctLayerAudio = useRef<HTMLAudioElement | null>(null);
  const wrongMainAudio = useRef<HTMLAudioElement | null>(null);
  const wrongLayerAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load audio files
    correctMainAudio.current = new Audio(SOUNDS.CORRECT);
    correctLayerAudio.current = new Audio(SOUNDS.CORRECT_LAYER);
    wrongMainAudio.current = new Audio(SOUNDS.WRONG);
    wrongLayerAudio.current = new Audio(SOUNDS.WRONG_LAYER);

    // Preload
    correctMainAudio.current.load();
    correctLayerAudio.current.load();
    wrongMainAudio.current.load();
    wrongLayerAudio.current.load();
  }, []);

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowVolumeControls(false); // Close volume panel on new question
  }, [questionIndex, questions]);

  const playSound = (correct: boolean) => {
    if (isMuted) return;
    try {
      if (correct) {
        // Play Correct Sounds Layered with custom volume
        // Base volume is 1.0, scaled by user setting
        if (correctMainAudio.current) {
          correctMainAudio.current.currentTime = 0;
          correctMainAudio.current.volume = 1.0 * volumeSettings.correct; 
          correctMainAudio.current.play().catch(e => console.log("Audio autoplay prevented:", e));
        }
        // Base volume for layer is 0.5, scaled by user setting
        if (correctLayerAudio.current) {
          correctLayerAudio.current.currentTime = 0;
          correctLayerAudio.current.volume = 0.5 * volumeSettings.correct; 
          // Slight delay for the sparkle to follow the chime
          setTimeout(() => {
             correctLayerAudio.current?.play().catch(() => {});
          }, 100);
        }
      } else {
        // Play Wrong Sounds Layered with custom volume
        // Base volume is 1.0, scaled by user setting
        if (wrongMainAudio.current) {
          wrongMainAudio.current.currentTime = 0;
          wrongMainAudio.current.volume = 1.0 * volumeSettings.wrong;
          wrongMainAudio.current.play().catch(e => console.log("Audio autoplay prevented:", e));
        }
        // Base volume for layer is 0.6, scaled by user setting
        if (wrongLayerAudio.current) {
          wrongLayerAudio.current.currentTime = 0;
          wrongLayerAudio.current.volume = 0.6 * volumeSettings.wrong;
          setTimeout(() => {
            wrongLayerAudio.current?.play().catch(() => {});
         }, 50);
        }
      }
    } catch (e) {
      console.error("Audio playback error", e);
    }
  };

  const triggerFlowerEffect = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    // Enhanced vibrant flower palette
    const colors = ['#ff6b6b', '#ff9ff3', '#feca57', '#ff4757', '#2ed573', '#badc58', '#dff9fb', '#fd79a8', '#a29bfe', '#6c5ce7'];

    (function frame() {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) return;

      const particleCount = 3 + Math.floor(Math.random() * 3);

      // 1. Gentle petals falling from top with random drift (Rain)
      confetti({
        particleCount: particleCount,
        angle: 60 + Math.random() * 60, // 60 to 120 degrees
        spread: 55 + Math.random() * 20,
        origin: { x: Math.random(), y: -0.1 }, // Random starting X at top
        colors: colors,
        shapes: ['circle'], // Circle looks like petals
        scalar: 0.8 + Math.random() * 0.8, // Varied sizes
        drift: (Math.random() - 0.5) * 1.5, // Random sway
        gravity: 0.25 + Math.random() * 0.2, // Slow fall
        ticks: 300,
        disableForReducedMotion: true
      });

      // 2. Occasional Side Bursts (Celebration) - More dynamic
      if (Math.random() > 0.85) {
         // Left side burst
         confetti({
           particleCount: 8 + Math.random() * 8,
           angle: 55 + Math.random() * 15, // Angled right
           spread: 40 + Math.random() * 30,
           origin: { x: -0.05, y: 0.5 + Math.random() * 0.3 }, // Left side, varying height
           colors: colors,
           startVelocity: 40 + Math.random() * 15,
           decay: 0.9,
           gravity: 0.8,
           scalar: 1.1,
           drift: 0.5,
           ticks: 150,
           shapes: ['circle']
         });
         
         // Right side burst
         confetti({
           particleCount: 8 + Math.random() * 8,
           angle: 125 - Math.random() * 15, // Angled left
           spread: 40 + Math.random() * 30,
           origin: { x: 1.05, y: 0.5 + Math.random() * 0.3 }, // Right side, varying height
           colors: colors,
           startVelocity: 40 + Math.random() * 15,
           decay: 0.9,
           gravity: 0.8,
           scalar: 1.1,
           drift: -0.5,
           ticks: 150,
           shapes: ['circle']
         });
      }

      requestAnimationFrame(frame);
    }());
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;

    const correct = index === currentQuestion.correctIndex;
    setSelectedOption(index);
    setIsAnswered(true);
    setIsCorrect(correct);
    onAnswer(correct);
    playSound(correct);

    if (correct) {
      triggerFlowerEffect();
    }
  };

  // --- Dynamic Theme Logic ---
  const getTheme = (currentLevel: LevelType) => {
    switch (currentLevel) {
      case LevelType.LEVEL_3:
        return {
          topBarBorder: "border-purple-200",
          levelTitleColor: "text-purple-800",
          levelBadgeBg: "bg-purple-100 text-purple-700 border-purple-200",
          questionCardBorder: "border-purple-200",
          questionCardGradient: "from-purple-500 to-fuchsia-600",
          questionCardShadow: "shadow-purple-200/50",
          optionDefault: "bg-white border-purple-100 hover:border-purple-400 hover:bg-purple-50 text-slate-700 shadow-purple-100",
          nextBtn: "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 hover:from-fuchsia-400 hover:via-purple-400 hover:to-pink-400 ring-4 ring-purple-100 shadow-purple-300",
          progressBarBg: "bg-purple-100",
          progressBarFill: "bg-gradient-to-r from-purple-400 to-fuchsia-500",
          feedbackBg: "bg-purple-50"
        };
      case LevelType.SPECIAL:
        // High-contrast, Premium "Royal Challenge" Theme (Gold & Deep Red)
        return {
          topBarBorder: "border-yellow-500/50",
          levelTitleColor: "text-red-800",
          levelBadgeBg: "bg-gradient-to-r from-red-600 to-rose-600 text-white border-none shadow-md",
          questionCardBorder: "border-yellow-400", // Gold border
          questionCardGradient: "from-yellow-500 via-orange-500 to-red-600", // Intense gradient
          questionCardShadow: "shadow-orange-500/30",
          optionDefault: "bg-white border-red-100 hover:border-yellow-500 hover:bg-yellow-50/50 text-slate-800 shadow-orange-100",
          nextBtn: "bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600 hover:from-yellow-400 hover:via-orange-500 hover:to-red-500 text-white ring-4 ring-yellow-200 shadow-orange-400",
          progressBarBg: "bg-orange-100",
          progressBarFill: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600",
          feedbackBg: "bg-orange-50"
        };
       case LevelType.GRADUATION:
        // Luxury Platinum/Blue theme for "Thien Tai"
        return {
          topBarBorder: "border-cyan-200",
          levelTitleColor: "text-blue-900",
          levelBadgeBg: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none shadow",
          questionCardBorder: "border-cyan-200",
          questionCardGradient: "from-blue-600 via-cyan-500 to-teal-500",
          questionCardShadow: "shadow-cyan-200/50",
          optionDefault: "bg-white border-cyan-100 hover:border-cyan-400 hover:bg-cyan-50 text-slate-800 shadow-cyan-100",
          nextBtn: "bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:via-cyan-500 hover:to-teal-500 text-white ring-4 ring-cyan-100 shadow-cyan-300",
          progressBarBg: "bg-cyan-100",
          progressBarFill: "bg-gradient-to-r from-blue-500 to-cyan-400",
           feedbackBg: "bg-cyan-50"
        };
      default: // Level 1 & 2
        return {
          topBarBorder: "border-blue-100",
          levelTitleColor: "text-blue-800",
          levelBadgeBg: "bg-blue-50 text-blue-600 border-blue-100",
          questionCardBorder: "border-blue-100",
          questionCardGradient: "from-blue-500 to-indigo-600",
          questionCardShadow: "shadow-blue-200/50",
          optionDefault: "bg-white border-blue-100 hover:border-blue-400 hover:bg-blue-50 text-slate-700 shadow-blue-100",
          nextBtn: "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400 ring-4 ring-cyan-100 shadow-blue-300",
          progressBarBg: "bg-blue-100",
          progressBarFill: "bg-gradient-to-r from-blue-400 to-indigo-500",
           feedbackBg: "bg-blue-50"
        };
    }
  };

  const theme = getTheme(level);

  if (!currentQuestion) return (
    <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Đang tải câu hỏi...</p>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-1 md:gap-5 animate-fade-in relative pb-16 md:pb-0">
      
      {/* Top Bar - Very Compact */}
      <div className={`glass-panel px-2 py-1 md:p-4 rounded-lg md:rounded-xl shadow-sm border ${theme.topBarBorder} flex justify-between items-center gap-2 relative z-50`}>
        <div className="flex items-center gap-3 w-full">
            <div className="flex-1">
                 <div className="flex justify-between items-end mb-0.5 md:mb-1">
                    <span className={`font-black uppercase text-[10px] md:text-sm tracking-wide ${theme.levelTitleColor} flex items-center gap-1`}>
                       {level === LevelType.SPECIAL && <span className="text-lg animate-pulse">🔥</span>}
                       {level === LevelType.GRADUATION && <span className="text-lg animate-bounce">🎓</span>}
                       {level.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-white/50 ${theme.levelBadgeBg}`}>
                        {questionIndex + 1}/{questions.length}
                    </span>
                 </div>
                 <div className={`h-1.5 md:h-2.5 w-full rounded-full overflow-hidden ${theme.progressBarBg} shadow-inner`}>
                    <div className={`h-full rounded-full transition-all duration-700 ease-out ${theme.progressBarFill}`} style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}></div>
                 </div>
            </div>
            
            {/* Volume Mixer Toggle */}
            <div className="relative">
                <button 
                  onClick={() => setShowVolumeControls(!showVolumeControls)}
                  className="p-1 md:p-2 rounded-lg bg-white/50 hover:bg-white text-slate-500 hover:text-blue-600 transition-colors border border-transparent hover:border-slate-200"
                  title="Chỉnh âm lượng"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 1 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                      <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                    </svg>
                </button>

                {/* Volume Popup */}
                {showVolumeControls && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 p-4 animate-fade-in z-[60]">
                    <div className="flex justify-between items-center mb-3">
                       <h4 className="text-xs font-bold uppercase text-slate-500">Cài đặt âm thanh</h4>
                       <button onClick={() => setShowVolumeControls(false)} className="text-slate-400 hover:text-slate-600">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>
                       </button>
                    </div>

                    <div className="space-y-4">
                      {/* Correct Volume */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-green-600 font-bold flex items-center gap-1">
                             <span>🌸</span> Đúng
                          </span>
                          <span className="text-slate-500 font-mono">{Math.round(volumeSettings.correct * 100)}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="1" step="0.1"
                          value={volumeSettings.correct}
                          onChange={(e) => onUpdateVolume({...volumeSettings, correct: parseFloat(e.target.value)})}
                          className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                      </div>

                      {/* Wrong Volume */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                           <span className="text-red-500 font-bold flex items-center gap-1">
                             <span>🤡</span> Sai
                          </span>
                          <span className="text-slate-500 font-mono">{Math.round(volumeSettings.wrong * 100)}%</span>
                        </div>
                         <input 
                          type="range" 
                          min="0" max="1" step="0.1"
                          value={volumeSettings.wrong}
                          onChange={(e) => onUpdateVolume({...volumeSettings, wrong: parseFloat(e.target.value)})}
                          className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
            </div>
        </div>
      </div>

      {/* Question Card - Extremely Compact for Mobile */}
      <div className={`bg-white rounded-lg md:rounded-2xl p-2 md:p-10 border-b-2 md:border-b-4 ${theme.questionCardBorder} shadow-sm md:shadow-lg ${theme.questionCardShadow} min-h-[70px] md:min-h-[220px] flex items-center justify-center relative overflow-hidden group transition-all duration-500 mb-0 md:mb-1 shrink-0`}>
        {/* Gradient Top Bar */}
        <div className={`absolute top-0 left-0 w-full h-1 md:h-1.5 bg-gradient-to-r ${theme.questionCardGradient}`}></div>
        
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 pointer-events-none"></div>

        {/* Question Text - Smaller, snug leading */}
        <h2 className="text-sm md:text-3xl font-bold text-slate-800 text-center leading-snug md:leading-normal z-10 serif-font w-full max-h-[100px] md:max-h-none overflow-y-auto custom-scrollbar px-1 md:px-2">
          {currentQuestion.content}
        </h2>
        
        {/* Quotes hidden on mobile to save space */}
        <div className={`hidden md:block absolute top-1 left-1 text-8xl opacity-10 serif-font select-none ${theme.levelTitleColor}`}>“</div>
        <div className={`hidden md:block absolute bottom-1 right-1 text-8xl opacity-10 serif-font select-none rotate-180 ${theme.levelTitleColor}`}>“</div>
      </div>

      {/* Options Grid - Very Compact, Auto height to fit text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-5">
        {currentQuestion.options.map((option, index) => {
          let btnClass = "relative px-2 py-2 md:p-6 rounded-lg md:rounded-xl text-[11px] md:text-lg font-medium transition-all duration-300 ease-out transform shadow-sm min-h-[40px] h-auto md:min-h-[100px] flex items-center justify-center text-center border border-b-2 md:border-b-4 ";
          
          if (isAnswered) {
             if (index === currentQuestion.correctIndex) {
                 btnClass += "bg-green-50 border-green-500 text-green-800 shadow-green-100 cursor-default";
             } else if (index === selectedOption) {
                 btnClass += "bg-red-50 border-red-500 text-red-800 shadow-red-100 opacity-90 cursor-default";
             } else {
                 btnClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-50 scale-95 border-b cursor-not-allowed";
             }
          } else {
             // Added hover:scale-[1.02] and hover:shadow-lg for enhanced effect on active buttons
             btnClass += `${theme.optionDefault} hover:scale-[1.02] hover:-translate-y-0.5 md:hover:-translate-y-1 hover:shadow-lg cursor-pointer bg-white active:scale-95 active:border-b active:translate-y-0.5 md:active:translate-y-1`;
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered}
              className={btnClass}
            >
              <span className="relative z-10 break-words w-full leading-tight md:leading-snug">{option}</span>
              {/* Option Index Indicator */}
              <span className={`absolute top-1 left-1.5 text-[8px] md:text-[10px] font-black px-1 md:px-1.5 py-0.5 rounded ${isAnswered && index === currentQuestion.correctIndex ? 'bg-green-200 text-green-900' : 'bg-slate-100 text-slate-500'}`}>
                {String.fromCharCode(65 + index)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback Section */}
      {isAnswered && (
        <div className={`fixed bottom-0 left-0 right-0 md:static md:mt-2 z-[60] animate-slide-up shadow-2xl md:shadow-xl md:rounded-3xl border-t-4 md:border-none border-white/20 ${isCorrect ? 'bg-gradient-to-br from-green-600 via-emerald-600 to-green-700' : 'bg-gradient-to-br from-red-600 via-orange-600 to-red-700'}`}>
          <div className="bg-white/95 md:bg-white/95 backdrop-blur-xl md:rounded-[1.3rem] p-3 md:p-8 flex flex-col md:flex-row items-center gap-3 md:gap-6 max-h-[60vh] overflow-y-auto md:max-h-none md:overflow-visible">
            
            {/* Mobile Header Row */}
            <div className="flex items-center gap-3 w-full md:w-auto border-b md:border-none pb-2 md:pb-0 border-slate-200/50">
                <div className={`text-4xl md:text-8xl drop-shadow-md filter ${isCorrect ? '' : 'grayscale-[0.2]'}`}>
                    {isCorrect ? '🌸' : '🤡'} 
                </div>
                <h3 className={`text-xl md:text-3xl font-black uppercase tracking-tight flex-1 md:hidden ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
                    {isCorrect ? 'Chính xác!' : 'Sai rồi!'}
                </h3>
            </div>

            {/* Desktop Heading & Content */}
            <div className="flex-1 text-left w-full">
              <h3 className={`hidden md:block text-3xl font-black mb-3 uppercase tracking-tight ${isCorrect ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-700' : 'text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-orange-700'}`}>
                {isCorrect ? 'Tuyệt vời! Chính xác!' : 'Sai mất rồi! Tiếc quá!'}
              </h3>
              
              <div className="bg-slate-50/80 p-3 md:p-6 rounded-xl border border-slate-200 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-100 text-blue-600 p-1 md:p-1.5 rounded-lg shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-5 md:h-5">
                             <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="font-bold text-slate-700 uppercase text-[10px] md:text-sm tracking-wider">Giải thích chi tiết</span>
                </div>
                
                <p className="text-slate-800 text-sm md:text-lg leading-relaxed md:leading-8 font-medium">
                  {currentQuestion.explanation}
                </p>
                
                {currentQuestion.citation && (
                   <div className="mt-4 pt-3 border-t-2 border-dashed border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-2 opacity-90">
                      <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 px-2 py-1 rounded text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                        </svg>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest">Nguồn thơ</span>
                      </div>
                      <div className="text-sm md:text-base font-medium text-slate-800 serif-font italic leading-snug">
                         — {currentQuestion.citation}
                      </div>
                    </div>
                )}
              </div>
            </div>
            
            {/* Next Button */}
            <div className="mt-2 md:mt-0 w-full md:w-auto">
              <button 
                onClick={onNext}
                className={`w-full md:w-auto px-6 py-3 md:px-8 md:py-4 ${theme.nextBtn} text-white font-bold text-base md:text-lg rounded-xl md:rounded-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group whitespace-nowrap border-b-4 border-black/10 active:border-b-0 active:translate-y-1`}
              >
                KẾ TIẾP 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
