'use client';

import { Round, Player } from '@/types/game';

interface JudgingScreenProps {
  round: Round;
  judge: Player | undefined;
  onSelectWinner: (playerId: string) => void;
}

export function JudgingScreen({ round, judge, onSelectWinner }: JudgingScreenProps) {
  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold title-text mb-2">
            Time to Judge!
          </h2>
          {judge ? (
            <p className="text-xl text-purple/70">
              {judge.name}, pick your favorite caption!
            </p>
          ) : (
            <p className="text-xl text-amber-600">
              Anyone can pick the winner (host controls)
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="card p-4">
            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
              {round.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={round.imageUrl}
                  alt="The meme"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Captions to choose from */}
          <div className="card">
            <h3 className="text-xl font-bold text-purple mb-4">
              Select the Winner
            </h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {round.captions.map((caption) => (
                <button
                  key={caption.playerId}
                  onClick={() => onSelectWinner(caption.playerId)}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left
                    transition-all duration-200 hover:scale-102
                    bg-white/70 border-gold/30 hover:border-gold hover:bg-gold/10
                  `}
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
      </div>
    </div>
  );
}
