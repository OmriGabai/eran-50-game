'use client';

import { Round, Player, GamePhase } from '@/types/game';
import { Timer } from '../shared/Timer';
import { MemeImage } from '../shared/MemeImage';
import { CAPTION_TIME_SECONDS } from '@/types/game';

interface JudgeViewProps {
  phase: GamePhase;
  round: Round;
  players: Player[];
  timeRemaining: number;
  onSelectWinner?: (playerId: string) => void;
}

// Helper to split caption into top/bottom text
function splitCaption(text: string): { topText?: string; bottomText?: string } {
  if (!text) return {};

  const lines = text.split('\n');
  if (lines.length >= 2) {
    return { topText: lines[0], bottomText: lines.slice(1).join('\n') };
  }
  // Single line - put at bottom (more common meme style)
  return { bottomText: text };
}

export function JudgeView({ phase, round, players, timeRemaining, onSelectWinner }: JudgeViewProps) {
  const activePlayers = players.filter(p => p.isConnected && !p.isJudge);
  const submittedCount = activePlayers.filter(p => p.hasSubmitted).length;

  // During caption phase - show submission progress
  if (phase === 'caption') {
    return (
      <div className="min-h-screen min-h-[100dvh] gradient-bg flex flex-col p-3 sm:p-4 safe-area-top safe-area-bottom" dir="rtl">
        <div className="mb-3">
          <Timer seconds={timeRemaining} maxSeconds={CAPTION_TIME_SECONDS} />
        </div>

        <div className="text-center mb-3">
          <span className="bg-gold text-purple-dark px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-lg">
            {'\u{1F451}'} מצב שופט יום הולדת
          </span>
        </div>

        <div className="card flex-1 flex flex-col">
          <h2 className="text-lg sm:text-xl font-bold text-purple mb-3 text-center">
            השחקנים כותבים כיתובים...
          </h2>

          <div className="text-center mb-4">
            <div className="text-5xl sm:text-6xl font-bold text-gold tabular-nums">
              {submittedCount}/{activePlayers.length}
            </div>
            <p className="text-purple/60 text-sm">הגישו</p>
          </div>

          {/* Show all player images in a grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto">
            {activePlayers.map(player => (
              <div key={player.id} className="relative">
                <div className={`relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg
                  ${player.hasSubmitted ? 'ring-2 ring-green-500' : 'opacity-60'}`}>
                  {player.currentImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={player.currentImageUrl}
                      alt={`תמונה של ${player.name}`}
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                </div>
                <div className={`text-center text-xs mt-1 font-medium ${player.hasSubmitted ? 'text-green-600' : 'text-purple/40'}`}>
                  {player.name} {player.hasSubmitted ? '\u{2705}' : '...'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // During reveal - just watch
  if (phase === 'reveal') {
    return (
      <div className="min-h-screen gradient-bg flex flex-col p-4" dir="rtl">
        <div className="text-center mb-4">
          <span className="bg-gold text-purple-dark px-3 py-1 rounded-full text-sm font-bold">
            מצב שופט יום הולדת {'\u{1F389}'}
          </span>
        </div>

        <div className="card flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">{'\u{1F440}'}</div>
            <h2 className="text-xl font-bold text-purple">
              תסתכל על המסך!
            </h2>
            <p className="text-purple/60 mt-2">
              הכיתובים נחשפים...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // During judging - can pick winner with MEME IMAGES
  if (phase === 'judging') {
    return (
      <div className="min-h-screen min-h-[100dvh] gradient-bg flex flex-col p-3 sm:p-4 safe-area-top safe-area-bottom" dir="rtl">
        <div className="text-center mb-3">
          <span className="bg-gold text-purple-dark px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-lg animate-pulse">
            {'\u{1F3C6}'} בחר את המועדף!
          </span>
        </div>

        <div className="card flex-1 overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-bold text-purple mb-4 text-center">
            לחץ לבחירת המנצח
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {round.captions.map((caption) => {
              const { topText, bottomText } = splitCaption(caption.text);
              return (
                <button
                  key={caption.playerId}
                  onClick={() => onSelectWinner?.(caption.playerId)}
                  className="w-full rounded-xl border-2 text-right
                    bg-white/70 border-gold/30 hover:border-gold hover:bg-gold/10
                    transition-all active:scale-98 touch-manipulation overflow-hidden"
                >
                  {/* Meme image with text */}
                  <MemeImage
                    imageUrl={caption.imageUrl}
                    topText={topText}
                    bottomText={bottomText}
                  />
                  {/* Player name and speed bonus */}
                  <div className="p-2 flex justify-between items-center">
                    <span className="text-sm text-purple/60">{caption.playerName}</span>
                    {caption.speedBonus > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        +{caption.speedBonus} בונוס
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Winner announced or other phases - show score status
  return (
    <div className="min-h-screen min-h-[100dvh] gradient-bg flex flex-col p-3 sm:p-4 safe-area-top safe-area-bottom" dir="rtl">
      <div className="text-center mb-4">
        <span className="bg-gold text-purple-dark px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-lg">
          {'\u{1F451}'} מצב שופט יום הולדת
        </span>
      </div>

      <div className="card flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl sm:text-8xl mb-4">
            {phase === 'winner' ? '\u{1F3C6}' : '\u{1F389}'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-purple">
            {phase === 'winner' ? 'בחירה מצוינת!' : 'תסתכל על המסך!'}
          </h2>
          {phase === 'winner' && (
            <p className="text-purple/60 mt-2">ממתינים לסיבוב הבא...</p>
          )}
        </div>
      </div>
    </div>
  );
}
