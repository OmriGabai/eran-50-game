'use client';

import { Round, Player } from '@/types/game';
import { Timer } from '../shared/Timer';
import { CAPTION_TIME_SECONDS } from '@/types/game';

interface CaptionScreenProps {
  round: Round;
  players: Player[];
  timeRemaining: number;
}

const roundTypeHebrew = {
  normal: 'רגיל',
  roast: 'צליה',
  tribute: 'מחווה'
};

export function CaptionScreen({ round, players, timeRemaining }: CaptionScreenProps) {
  const activePlayers = players.filter(p => p.isConnected && !p.isJudge);
  const submittedCount = activePlayers.filter(p => p.hasSubmitted).length;

  return (
    <div className="min-h-screen gradient-bg p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-purple">
            סיבוב {round.number} - {roundTypeHebrew[round.type]}
          </div>
          <div className="bg-gold/20 px-4 py-2 rounded-full">
            <span className="font-bold text-gold">{round.points} נק׳</span>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-8">
          <Timer seconds={timeRemaining} maxSeconds={CAPTION_TIME_SECONDS} />
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Show all player images in a grid */}
          <div className="lg:col-span-2">
            <div className="card p-4">
              <h3 className="text-lg font-bold text-purple mb-3 text-center">התמונות של השחקנים</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {activePlayers.map(player => (
                  <div key={player.id} className="relative">
                    <div className={`relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg
                      ${player.hasSubmitted ? 'ring-2 ring-green-500' : 'opacity-70'}`}>
                      {player.currentImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={player.currentImageUrl}
                          alt={`תמונה של ${player.name}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-400 text-sm">טוען...</span>
                        </div>
                      )}
                    </div>
                    <div className={`text-center text-xs mt-1 font-medium ${player.hasSubmitted ? 'text-green-600' : 'text-purple/40'}`}>
                      {player.name} {player.hasSubmitted ? '\u{2705}' : '...'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submission status */}
          <div className="card">
            <h3 className="text-xl font-bold text-purple mb-4">הגשות</h3>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gold">
                {submittedCount}/{activePlayers.length}
              </div>
              <p className="text-purple/60">שחקנים הגישו</p>
            </div>

            <div className="space-y-2">
              {activePlayers.map(player => (
                <div
                  key={player.id}
                  className={`
                    flex items-center justify-between p-2 rounded-lg
                    ${player.hasSubmitted ? 'bg-green-100' : 'bg-gray-100'}
                  `}
                >
                  <span className="font-medium text-purple-dark">{player.name}</span>
                  {player.hasSubmitted ? (
                    <span className="text-green-600">{'\u{2713}'}</span>
                  ) : (
                    <span className="text-gray-400">...</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
