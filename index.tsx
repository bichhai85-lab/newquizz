
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from './components/Layout';
import { IntroScreen } from './components/IntroScreen';
import { QuizScreen } from './components/QuizScreen';
import { RoadmapScreen } from './components/RoadmapScreen';
import { LevelIntroScreen } from './components/LevelIntroScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { LevelResultScreen } from './components/LevelResultScreen';
import { CertificateScreen } from './components/CertificateScreen';
import { fetchQuestions } from './geminiService';
import { UserInfo, LevelType, GameState, CertificateRank } from './types';
import { SOUNDS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    screen: 'INTRO',
    currentLevel: LevelType.LEVEL_1,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    user: { name: '', className: '', school: '' },
    streak: 0,
    xp: 0
  });
  
  const [completionCount, setCompletionCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  // Independent volume settings (0.0 to 1.0)
  const [volumeSettings, setVolumeSettings] = useState({ correct: 1.0, wrong: 1.0 });

  useEffect(() => {
    const savedCount = localStorage.getItem('roboki_completion_count');
    if (savedCount) {
      setCompletionCount(parseInt(savedCount, 10));
    }
  }, []);

  const handleUserInfoSubmit = (user: UserInfo) => {
    // Go to Roadmap instead of Loading directly
    setGameState(prev => ({ ...prev, user, screen: 'ROADMAP' }));
  };

  const startLevel1 = () => {
    setGameState(prev => ({ ...prev, screen: 'LOADING' }));
    loadLevel(LevelType.LEVEL_1);
  };

  const loadLevel = async (level: LevelType) => {
    try {
      setGameState(prev => ({ 
        ...prev, 
        screen: 'LOADING', 
        currentLevel: level, 
        currentQuestionIndex: 0, 
        score: 0,
        questions: [] 
      }));

      const questions = await fetchQuestions(level);
      
      // Instead of going directly to PLAYING, go to LEVEL_INTRO
      // This allows the user to see the intro card after data is fetched
      setGameState(prev => ({
        ...prev,
        questions,
        screen: 'LEVEL_INTRO'
      }));
    } catch (error) {
      console.error("Failed to load level", error);
      setGameState(prev => ({ ...prev, screen: 'ERROR' }));
    }
  };

  const handleStartLevel = () => {
    setGameState(prev => ({ ...prev, screen: 'PLAYING' }));
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setGameState(prev => ({ ...prev, score: prev.score + 1, xp: prev.xp + 10 }));
    }
  };

  const handleNextQuestion = () => {
    const { currentQuestionIndex, questions, score, currentLevel } = gameState;
    
    if (currentQuestionIndex < questions.length - 1) {
      setGameState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    } else {
      // Level Finished
      handleLevelComplete(score, questions.length, currentLevel);
    }
  };

  const handleLevelComplete = (score: number, total: number, level: LevelType) => {
    // Logic for sound is now handled in LevelResultScreen for better lifecycle management
    setGameState(prev => ({ ...prev, screen: 'LEVEL_RESULT' }));
  };

  const nextStage = () => {
    const { currentLevel } = gameState;
    
    if (currentLevel === LevelType.LEVEL_1) {
      loadLevel(LevelType.LEVEL_2);
    } else if (currentLevel === LevelType.LEVEL_2) {
      loadLevel(LevelType.LEVEL_3);
    } else if (currentLevel === LevelType.LEVEL_3) {
      // Finished Core Levels -> Increment count -> Certificate
      // NOTE: We update completionCount BEFORE changing screen to ensure CertificateScreen gets the new count
      const newCount = completionCount + 1;
      setCompletionCount(newCount);
      localStorage.setItem('roboki_completion_count', newCount.toString());
      
      setGameState(prev => ({ ...prev, screen: 'CERTIFICATE' }));
    } else if (currentLevel === LevelType.SPECIAL) {
      // Finished Special -> Unlock Graduation Invitation in Result Screen
      // The button in Result Screen handles the navigation, or we navigate here if logic demands
      // But typically nextStage is called by the "Next" button in Result Screen.
      // If passing Special, we go to Graduation.
      loadLevel(LevelType.GRADUATION);
    } else if (currentLevel === LevelType.GRADUATION) {
       // Finished Graduation -> Certificate (Thiên Tài)
       setGameState(prev => ({ ...prev, screen: 'CERTIFICATE' }));
    }
  };

  const retryLevel = () => {
    loadLevel(gameState.currentLevel);
  };

  const startSpecialRound = () => {
    loadLevel(LevelType.SPECIAL);
  };

  const restartGame = () => {
    // Reset to Level 1 but keep XP and User info
    loadLevel(LevelType.LEVEL_1);
  };

  const getRank = (count: number, level: LevelType): string => {
    if (level === LevelType.GRADUATION) return CertificateRank.THIEN_TAI;
    if (level === LevelType.SPECIAL) return CertificateRank.NHAN_TAI;
    
    // Core Levels Ranking Logic
    if (count >= 9) return CertificateRank.XUAT_SAC;
    if (count >= 6) return CertificateRank.GIOI;
    if (count >= 3) return CertificateRank.KHA;
    return CertificateRank.DAT;
  };

  // Determine Rank for props
  // IMPORTANT: We use completionCount state which is updated right before screen transition
  const rank = getRank(completionCount, gameState.currentLevel);
  // Force ranks based on specific ending levels like before
  const finalRank = gameState.currentLevel === LevelType.GRADUATION ? CertificateRank.THIEN_TAI : 
                    gameState.currentLevel === LevelType.SPECIAL ? CertificateRank.NHAN_TAI : rank;


  return (
    <Layout 
      isMuted={isMuted} 
      onToggleMute={() => setIsMuted(!isMuted)}
      xp={gameState.xp}
      userName={gameState.user.name}
    >
      {gameState.screen === 'INTRO' && <IntroScreen onStart={handleUserInfoSubmit} />}
      
      {gameState.screen === 'ROADMAP' && <RoadmapScreen user={gameState.user} xp={gameState.xp} completionCount={completionCount} onContinue={startLevel1} />}

      {gameState.screen === 'LOADING' && <LoadingScreen />}

      {gameState.screen === 'LEVEL_INTRO' && (
        <LevelIntroScreen 
          level={gameState.currentLevel} 
          onStart={handleStartLevel} 
        />
      )}
      
      {gameState.screen === 'PLAYING' && (
        <QuizScreen 
          level={gameState.currentLevel}
          questions={gameState.questions}
          questionIndex={gameState.currentQuestionIndex}
          onAnswer={handleAnswer}
          onNext={handleNextQuestion}
          userStreak={gameState.streak}
          isMuted={isMuted}
          volumeSettings={volumeSettings}
          onUpdateVolume={setVolumeSettings}
        />
      )}

      {gameState.screen === 'LEVEL_RESULT' && (
        <LevelResultScreen 
            score={gameState.score}
            total={gameState.questions.length}
            level={gameState.currentLevel}
            onNextStage={nextStage}
            onRetry={retryLevel}
            isMuted={isMuted}
        />
      )}
      
      {gameState.screen === 'CERTIFICATE' && (
        <CertificateScreen 
            user={gameState.user}
            rank={finalRank}
            xp={gameState.xp}
            currentLevel={gameState.currentLevel}
            completionCount={completionCount}
            onStartSpecial={startSpecialRound}
            onRestart={restartGame}
            isMuted={isMuted}
        />
      )}
      
      {gameState.screen === 'ERROR' && (
        <div className="text-center p-8 bg-white rounded-xl shadow-xl">
             <p className="text-red-500 font-bold mb-4">Có lỗi xảy ra khi tải dữ liệu.</p>
             <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-500 text-white rounded-lg">Tải lại trang</button>
        </div>
      )}
    </Layout>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
