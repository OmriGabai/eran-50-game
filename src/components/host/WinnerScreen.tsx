'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Round, Player } from '@/types/game';
import { MemeImage } from '../shared/MemeImage';

interface WinnerScreenProps {
  round: Round;
  players: Player[];
  onNextRound: () => void;
  onEndGame: () => void;
  isLastRound: boolean;
}

// Split caption into top and bottom text
function splitCaption(text: string): { top: string; bottom: string } {
  if (text.includes('\n')) {
    const parts = text.split('\n');
    return { top: parts[0], bottom: parts.slice(1).join(' ') };
  }
  if (text.length < 50) {
    return { top: '', bottom: text };
  }
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
}

export function WinnerScreen({ round, players, onNextRound, onEndGame, isLastRound }: WinnerScreenProps) {
  const winner = players.find(p => p.id === round.winningCaption?.playerId);
  const captionText = round.winningCaption?.text || '';
  const { top, bottom } = splitCaption(captionText);

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
          <div className="text-6xl mb-4">{'\u{1F3C6}'}</div>

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

          {/* Winning meme */}
          {round.imageUrl && (
            <div className="max-w-lg mx-auto mb-8">
              <MemeImage
                imageUrl={round.imageUrl}
                topText={top}
                bottomText={bottom}
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNextRound}
              className="btn-primary text-xl px-8 py-3"
            >
              {isLastRound ? 'Bonus Round!' : 'Next Round'}
            </button>
            <button
              onClick={onEndGame}
              className="btn-secondary text-xl px-8 py-3"
            >
              End Game
            </button>
          </div>
          {isLastRound && (
            <p className="text-purple/60 mt-4 text-sm">
              All planned rounds complete! Continue with bonus rounds or end the game.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
