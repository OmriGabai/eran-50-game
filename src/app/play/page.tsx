'use client';

import { useSocket } from '@/hooks/useSocket';
import { JoinScreen } from '@/components/player/JoinScreen';
import { WaitingScreen } from '@/components/player/WaitingScreen';
import { CaptionInput } from '@/components/player/CaptionInput';
import { JudgeView } from '@/components/player/JudgeView';
import { ResultsView } from '@/components/player/ResultsView';
import { PlayerList } from '@/components/shared/PlayerList';
import { BirthdayBanner } from '@/components/shared/BirthdayBanner';

export default function PlayPage() {
  const {
    isConnected,
    gameState,
    currentPlayer,
    playerId,
    timeRemaining,
    joinGame,
    submitCaption,
    selectWinner,
  } = useSocket();

  if (!isConnected) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="card text-center">
          <div className="text-4xl mb-4">&#128268;</div>
          <h2 className="text-xl font-bold text-purple">Connecting...</h2>
          <p className="text-purple/60 mt-2">Finding the party</p>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="card text-center">
          <div className="animate-spin text-4xl mb-4">&#127790;</div>
          <h2 className="text-xl font-bold text-purple">Loading...</h2>
        </div>
      </div>
    );
  }

  const { phase, players, currentRound } = gameState;

  // Not joined yet - show join screen
  if (!playerId || !currentPlayer) {
    return <JoinScreen onJoin={joinGame} />;
  }

  // In lobby - show waiting screen
  if (phase === 'lobby') {
    return <WaitingScreen players={players} currentPlayer={currentPlayer} />;
  }

  // Judge has special views
  if (currentPlayer.isJudge && currentRound) {
    return (
      <JudgeView
        phase={phase}
        round={currentRound}
        players={players}
        timeRemaining={timeRemaining}
        onSelectWinner={selectWinner}
      />
    );
  }

  // Caption phase - show input for regular players
  if (phase === 'caption' && currentRound) {
    return (
      <CaptionInput
        round={currentRound}
        player={currentPlayer}
        timeRemaining={timeRemaining}
        onSubmit={submitCaption}
      />
    );
  }

  // Game over screen for players
  if (phase === 'game-over') {
    const sortedPlayers = [...players]
      .filter(p => !p.isJudge)
      .sort((a, b) => b.score - a.score);
    const playerRank = sortedPlayers.findIndex(p => p.id === currentPlayer.id) + 1;

    return (
      <div className="min-h-screen gradient-bg p-4">
        <BirthdayBanner />

        <div className="card max-w-md mx-auto mt-4">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">&#127874;</div>
            <h2 className="text-2xl font-bold title-text">Game Over!</h2>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-purple/60">Your final score</p>
            <p className="text-5xl font-bold text-gold">{currentPlayer.score}</p>
            <p className="text-lg text-purple">
              {playerRank === 1 ? '&#127942; Winner!' : `#${playerRank} place`}
            </p>
          </div>

          <div className="bg-purple/5 rounded-lg p-4">
            <h3 className="text-sm font-bold text-purple mb-3">Final Standings</h3>
            <PlayerList players={sortedPlayers} showScores highlightId={currentPlayer.id} />
          </div>
        </div>
      </div>
    );
  }

  // Other phases - show results/waiting view
  return (
    <ResultsView
      phase={phase}
      round={currentRound}
      player={currentPlayer}
      players={players}
    />
  );
}
