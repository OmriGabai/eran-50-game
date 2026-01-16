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
      <div className="min-h-screen gradient-bg flex flex-col p-4">
        <div className="mb-4">
          <Timer seconds={timeRemaining} maxSeconds={CAPTION_TIME_SECONDS} />
        </div>

        <div className="text-center mb-4">
          <span className="bg-gold text-purple-dark px-3 py-1 rounded-full text-sm font-bold">
            Birthday Judge Mode &#127881;
          </span>
        </div>

        <div className="card flex-1">
          <h2 className="text-xl font-bold text-purple mb-4 text-center">
            Players are writing captions...
          </h2>

          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-gold">
              {submittedCount}/{activePlayers.length}
            </div>
            <p className="text-purple/60">submitted</p>
          </div>

          {/* Image preview */}
          <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
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
      <div className="min-h-screen gradient-bg flex flex-col p-4">
        <div className="text-center mb-4">
          <span className="bg-gold text-purple-dark px-3 py-1 rounded-full text-sm font-bold">
            Pick Your Favorite! &#127881;
          </span>
        </div>

        <div className="card flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold text-purple mb-4 text-center">
            Which caption wins?
          </h2>

          <div className="space-y-3">
            {round.captions.map((caption) => (
              <button
                key={caption.playerId}
                onClick={() => onSelectWinner?.(caption.playerId)}
                className="w-full p-4 rounded-lg border-2 text-left
                  bg-white/70 border-gold/30 hover:border-gold hover:bg-gold/10
                  transition-all active:scale-98"
              >
                <p className="text-lg font-medium text-purple-dark mb-1">
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
    <div className="min-h-screen gradient-bg flex flex-col p-4">
      <div className="text-center mb-4">
        <span className="bg-gold text-purple-dark px-3 py-1 rounded-full text-sm font-bold">
          Birthday Judge Mode &#127881;
        </span>
      </div>

      <div className="card flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {phase === 'winner' ? '&#127942;' : '&#127881;'}
          </div>
          <h2 className="text-xl font-bold text-purple">
            {phase === 'winner' ? 'Great pick!' : 'Watch the TV screen!'}
          </h2>
        </div>
      </div>
    </div>
  );
}
