'use client';

import { useSocket } from '@/hooks/useSocket';
import { LobbyScreen } from '@/components/host/LobbyScreen';
import { RoundStartScreen } from '@/components/host/RoundStartScreen';
import { CaptionScreen } from '@/components/host/CaptionScreen';
import { RevealScreen } from '@/components/host/RevealScreen';
import { JudgingScreen } from '@/components/host/JudgingScreen';
import { WinnerScreen } from '@/components/host/WinnerScreen';
import { GameOverScreen } from '@/components/host/GameOverScreen';

export default function HostPage() {
  const {
    isConnected,
    gameState,
    timeRemaining,
    startGame,
    nextReveal,
    selectWinner,
    nextRound,
    resetGame,
  } = useSocket();

  if (!isConnected) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="card text-center">
          <div className="text-4xl mb-4">&#128268;</div>
          <h2 className="text-2xl font-bold text-purple">Connecting...</h2>
          <p className="text-purple/60 mt-2">Setting up the party game</p>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="card text-center">
          <div className="animate-spin text-4xl mb-4">&#127790;</div>
          <h2 className="text-2xl font-bold text-purple">Loading game...</h2>
        </div>
      </div>
    );
  }

  const { phase, players, currentRound, roundNumber, totalRounds, revealIndex } = gameState;
  const judge = players.find(p => p.isJudge);
  const isLastRound = roundNumber >= totalRounds;

  switch (phase) {
    case 'lobby':
      return <LobbyScreen players={players} onStartGame={startGame} />;

    case 'round-start':
      if (!currentRound) return null;
      return <RoundStartScreen round={currentRound} />;

    case 'caption':
      if (!currentRound) return null;
      return (
        <CaptionScreen
          round={currentRound}
          players={players}
          timeRemaining={timeRemaining}
        />
      );

    case 'reveal':
      if (!currentRound) return null;
      return (
        <RevealScreen
          round={currentRound}
          revealIndex={revealIndex}
          onNextReveal={nextReveal}
        />
      );

    case 'judging':
      if (!currentRound) return null;
      return (
        <JudgingScreen
          round={currentRound}
          judge={judge}
          onSelectWinner={selectWinner}
        />
      );

    case 'winner':
      if (!currentRound) return null;
      return (
        <WinnerScreen
          round={currentRound}
          players={players}
          onNextRound={nextRound}
          isLastRound={isLastRound}
        />
      );

    case 'game-over':
      return <GameOverScreen players={players} onResetGame={resetGame} />;

    default:
      return null;
  }
}
