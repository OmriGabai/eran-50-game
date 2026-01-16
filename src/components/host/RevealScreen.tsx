'use client';

import { Round } from '@/types/game';

interface RevealScreenProps {
  round: Round;
  revealIndex: number;
  onNextReveal: () => void;
}

export function RevealScreen({ round, revealIndex, onNextReveal }: RevealScreenProps) {
  const revealedCaptions = round.captions.slice(0, revealIndex + 1);
  const allRevealed = revealIndex >= round.captions.length - 1;

  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-purple">Caption Reveal!</h2>
          <p className="text-purple/60">
            {revealIndex + 1} of {round.captions.length} captions
          </p>
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

          {/* Captions */}
          <div className="card">
            <h3 className="text-xl font-bold text-purple mb-4">Captions</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {revealedCaptions.map((caption, index) => (
                <div
                  key={caption.playerId}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-500
                    ${index === revealIndex
                      ? 'bg-gold/20 border-gold animate-slide-up scale-105'
                      : 'bg-white/50 border-transparent'
                    }
                  `}
                >
                  <p className="text-xl font-medium text-purple-dark mb-2">
                    &quot;{caption.text}&quot;
                  </p>
                  <p className="text-sm text-purple/60">- {caption.playerName}</p>
                </div>
              ))}
            </div>

            {/* Next button */}
            <div className="mt-6 text-center">
              <button
                onClick={onNextReveal}
                className={`btn-primary text-xl px-8 py-3 ${allRevealed ? 'bg-purple hover:bg-purple-dark' : ''}`}
              >
                {allRevealed ? 'Start Judging!' : 'Next Caption'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
