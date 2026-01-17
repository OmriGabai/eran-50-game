'use client';

import { Round, Player, GamePhase } from '@/types/game';
import { Timer } from '../shared/Timer';
import { CAPTION_TIME_SECONDS } from '@/types/game';

interface JudgeViewProps {
  phase: GamePhase;
  round: Round;
  players: Player[];
  timeRemaining: number;
  onSelectWinner?: (playerId: string) => void;
}

export function JudgeView({ phase, round, players, timeRemaining, onSelectWinner }: JudgeViewProps) {
  const activePlayers = players.filter(p => p.isConnected && !p.isJudge);
  const submittedCount = activePlayers.filter(p => p.hasSubmitted).length;

  // During caption phase - show submission progress
  if (phase === 'caption') {
    return (
      <div className="min-h-screen min-h-[100dvh] gradient-bg flex flex-col p-3 sm:p-4 safe-area-top safe-area-bottom">
        <div className="mb-3">
          <Timer seconds={timeRemaining} maxSeconds={CAPTION_TIME_SECONDS} />
        </div>

        <div className="text-center mb-3">
          <span className="bg-gold text-purple-dark px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-lg">
            {'\u{1F451}'} Birthday Judge Mode
          </span>
        </div>

        <div className="card flex-1 flex flex-col">
          <h2 className="text-lg sm:text-xl font-bold text-purple mb-3 text-center">
            Players are writing captions...
          </h2>

          <div className="text-center mb-4">
            <div className="text-5xl sm:text-6xl font-bold text-gold tabular-nums">
              {submittedCount}/{activePlayers.length}
            </div>
            <p className="text-purple/60 text-sm">submitted</p>
          </div>

          {/* Image preview */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative aspect-video w-full max-w-md bg-black rounded-lg overflow-hidden shadow-lg">
              {round.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={round.imageUrl}
                  alt="Current image"
                  className="w-full h-full object-contain"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // During reveal - just watch
  if (phase === 'reveal') {
    return (
      <div className="min-h-screen gradient-bg flex flex-col p-4">
        <div className="text-center mb-4">
          <span className="bg-gold text-purple-dark px-3 py-1 rounded-full text-sm font-bold">
            Birthday Judge Mode &#127881;
          </span>
        </div>

        <div className="card flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">&#128064;</div>
            <h2 className="text-xl font-bold text-purple">
              Watch the TV screen!
            </h2>
            <p className="text-purple/60 mt-2">
              Captions are being revealed...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // During judging - can pick winner
  if (phase === 'judging') {
    return (
      <div className="min-h-screen min-h-[100dvh] gradient-bg flex flex-col p-3 sm:p-4 safe-area-top safe-area-bottom">
        <div className="text-center mb-3">
          <span className="bg-gold text-purple-dark px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-lg animate-pulse">
            {'\u{1F3C6}'} Pick Your Favorite!
          </span>
        </div>

        <div className="card flex-1 overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-bold text-purple mb-4 text-center">
            Tap to select the winner
          </h2>

          <div className="space-y-3">
            {round.captions.map((caption) => (
              <button
                key={caption.playerId}
                onClick={() => onSelectWinner?.(caption.playerId)}
                className="w-full p-4 rounded-xl border-2 text-left
                  bg-white/70 border-gold/30 hover:border-gold hover:bg-gold/10
                  transition-all active:scale-98 touch-manipulation"
              >
                <p className="text-base sm:text-lg font-medium text-purple-dark mb-1">
                  &quot;{caption.text}&quot;
                </p>
                <p className="text-sm text-purple/60">- {caption.playerName}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Winner announced or other phases - show score status
  return (
    <div className="min-h-screen min-h-[100dvh] gradient-bg flex flex-col p-3 sm:p-4 safe-area-top safe-area-bottom">
      <div className="text-center mb-4">
        <span className="bg-gold text-purple-dark px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-lg">
          {'\u{1F451}'} Birthday Judge Mode
        </span>
      </div>

      <div className="card flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl sm:text-8xl mb-4">
            {phase === 'winner' ? '\u{1F3C6}' : '\u{1F389}'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-purple">
            {phase === 'winner' ? 'Great pick!' : 'Watch the TV screen!'}
          </h2>
          {phase === 'winner' && (
            <p className="text-purple/60 mt-2">Waiting for next round...</p>
          )}
        </div>
      </div>
    </div>
  );
}
