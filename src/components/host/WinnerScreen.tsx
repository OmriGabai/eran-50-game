'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Round, Player } from '@/types/game';

interface WinnerScreenProps {
  round: Round;
  players: Player[];
  onNextRound: () => void;
  isLastRound: boolean;
}

export function WinnerScreen({ round, players, onNextRound, isLastRound }: WinnerScreenProps) {
  const winner = players.find(p => p.id === round.winningCaption?.playerId);

  useEffect(() => {
    // Fire confetti!
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ['#D4AF37', '#6B2D5C', '#E5C76B', '#8B4D7C'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="min-h-screen gradient-bg p-8 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <div className="card p-12">
          <div className="text-6xl mb-4">&#127942;</div>

          <h2 className="text-4xl font-bold title-text mb-6">Winner!</h2>

          {winner && (
            <div className="mb-8">
              <div className="text-6xl font-bold text-gold mb-2">
                {winner.name}
              </div>
              <div className="text-2xl text-purple/70">
                +{round.points} points!
              </div>
            </div>
          )}

          {round.winningCaption && (
            <div className="bg-gold/10 p-6 rounded-xl mb-8">
              <p className="text-2xl font-medium text-purple-dark italic">
                &quot;{round.winningCaption.text}&quot;
              </p>
            </div>
          )}

          <div className="relative aspect-video max-w-md mx-auto bg-gray-200 rounded-lg overflow-hidden mb-8">
            {round.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={round.imageUrl}
                alt="Winning meme"
                className="w-full h-full object-contain"
              />
            ) : null}
          </div>

          <button
            onClick={onNextRound}
            className="btn-primary text-2xl px-12 py-4"
          >
            {isLastRound ? 'Final Scores!' : 'Next Round'}
          </button>
        </div>
      </div>
    </div>
  );
}
