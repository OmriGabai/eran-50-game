'use client';

import { Round, Player } from '@/types/game';
import { MemeImage } from '../shared/MemeImage';

interface JudgingScreenProps {
  round: Round;
  judge: Player | undefined;
  onSelectWinner: (playerId: string) => void;
}

export function JudgingScreen({ round, judge, onSelectWinner }: JudgingScreenProps) {
  // Split caption into top and bottom text if it contains a newline or is long
  const splitCaption = (text: string): { top: string; bottom: string } => {
    // If caption has a newline, split there
    if (text.includes('\n')) {
      const parts = text.split('\n');
      return { top: parts[0], bottom: parts.slice(1).join(' ') };
    }
    // If caption is short, just put it at the bottom
    if (text.length < 50) {
      return { top: '', bottom: text };
    }
    // For longer captions, try to split in the middle at a space
    const midpoint = Math.floor(text.length / 2);
    const spaceAfter = text.indexOf(' ', midpoint);
    const spaceBefore = text.lastIndexOf(' ', midpoint);
    const splitPoint = (spaceAfter !== -1 && spaceAfter - midpoint < midpoint - spaceBefore)
      ? spaceAfter
      : spaceBefore;

    if (splitPoint === -1) {
      return { top: '', bottom: text };
    }
    return { top: text.slice(0, splitPoint), bottom: text.slice(splitPoint + 1) };
  };

  return (
    <div className="min-h-screen gradient-bg p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold title-text mb-2">
            זמן לשפוט!
          </h2>
          {judge ? (
            <p className="text-xl text-purple/70">
              {judge.name}, בחר את המועדף עליך!
            </p>
          ) : (
            <p className="text-xl text-amber-600">
              כל אחד יכול לבחור מנצח (בשליטת המנחה)
            </p>
          )}
        </div>

        {/* Meme grid - each caption has its own image! */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {round.captions.map((caption) => {
            const { top, bottom } = splitCaption(caption.text);
            return (
              <button
                key={caption.playerId}
                onClick={() => onSelectWinner(caption.playerId)}
                className="group transition-all duration-200 hover:scale-105 focus:outline-none"
              >
                <div className="card p-3 group-hover:border-gold group-hover:shadow-2xl transition-all">
                  {/* Use caption.imageUrl - each player had their own image! */}
                  <MemeImage
                    imageUrl={caption.imageUrl}
                    topText={top}
                    bottomText={bottom}
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-purple/60">- {caption.playerName}</span>
                    {caption.speedBonus > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        +{caption.speedBonus} בונוס
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
