'use client';

import { Round, RoundType } from '@/types/game';

interface RoundStartScreenProps {
  round: Round;
}

const roundTypeLabels: Record<RoundType, { title: string; description: string; emoji: string }> = {
  normal: { title: 'Caption This!', description: 'Make it funny!', emoji: '&#128514;' },
  roast: { title: 'Roast Round!', description: 'Personal photo time - be ruthless!', emoji: '&#128293;' },
  tribute: { title: 'Tribute Round', description: 'Show some love to the birthday boy!', emoji: '&#10084;&#65039;' },
};

export function RoundStartScreen({ round }: RoundStartScreenProps) {
  const typeInfo = roundTypeLabels[round.type];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="text-center animate-fade-in">
        <div className="text-8xl mb-4" dangerouslySetInnerHTML={{ __html: typeInfo.emoji }} />

        <h1 className="text-6xl font-bold text-purple mb-4">
          Round {round.number}
        </h1>

        <h2 className="text-4xl font-bold title-text mb-4">
          {typeInfo.title}
        </h2>

        <p className="text-2xl text-purple/70 mb-8">
          {typeInfo.description}
        </p>

        <div className="inline-block bg-gold/20 px-6 py-3 rounded-full">
          <span className="text-xl font-bold text-gold">
            {round.points} points at stake!
          </span>
        </div>
      </div>
    </div>
  );
}
