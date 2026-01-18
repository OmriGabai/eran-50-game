'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '@/types/game';
import { PlayerList } from '../shared/PlayerList';

interface GameOverScreenProps {
  players: Player[];
  onResetGame: () => void;
}

export function GameOverScreen({ players, onResetGame }: GameOverScreenProps) {
  const sortedPlayers = [...players]
    .filter(p => !p.isJudge)
    .sort((a, b) => b.score - a.score);
  const podium = sortedPlayers.slice(0, 3);
  const others = sortedPlayers.slice(3);

  useEffect(() => {
    // Grand finale confetti
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const colors = ['#D4AF37', '#6B2D5C', '#E5C76B', '#8B4D7C', '#FFD700'];

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.6 },
        colors,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst at start
    confetti({
      particleCount: 200,
      spread: 160,
      origin: { y: 0.35 },
      colors,
    });
  }, []);

  return (
    <div className="min-h-screen gradient-bg p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Birthday Message */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{'\u{1F382}'} {'\u{1F389}'} {'\u{1F381}'}</div>
          <h1 className="text-5xl font-bold title-text mb-4">
            יום הולדת שמח לערן, בן 50!
          </h1>
          <p className="text-xl text-purple/70">
            תודה שהשתתפתם! שיהיו עוד הרבה שנים של צחוקים!
          </p>
        </div>

        {/* Podium */}
        <div className="card mb-8">
          <h2 className="text-3xl font-bold text-purple text-center mb-8">
            טבלת תוצאות סופית
          </h2>

          <div className="flex justify-center items-end gap-4 mb-8">
            {/* Second place */}
            {podium[1] && (
              <div className="text-center">
                <div className="bg-gray-300 rounded-lg p-4 min-w-[120px]">
                  <div className="text-4xl mb-2">{'\u{1F948}'}</div>
                  <p className="font-bold text-lg text-gray-700">{podium[1].name}</p>
                  <p className="text-xl font-bold text-gray-600">{podium[1].score}</p>
                </div>
                <div className="bg-gray-300 h-24 rounded-b-lg -mt-2"></div>
              </div>
            )}

            {/* First place */}
            {podium[0] && (
              <div className="text-center -mt-8">
                <div className="bg-gold rounded-lg p-6 min-w-[140px] animate-pulse-gold">
                  <div className="text-5xl mb-2">{'\u{1F3C6}'}</div>
                  <p className="font-bold text-xl text-purple-dark">{podium[0].name}</p>
                  <p className="text-2xl font-bold text-purple">{podium[0].score}</p>
                </div>
                <div className="bg-gold h-32 rounded-b-lg -mt-2"></div>
              </div>
            )}

            {/* Third place */}
            {podium[2] && (
              <div className="text-center">
                <div className="bg-amber-600 rounded-lg p-4 min-w-[120px]">
                  <div className="text-4xl mb-2">{'\u{1F949}'}</div>
                  <p className="font-bold text-lg text-white">{podium[2].name}</p>
                  <p className="text-xl font-bold text-amber-100">{podium[2].score}</p>
                </div>
                <div className="bg-amber-600 h-16 rounded-b-lg -mt-2"></div>
              </div>
            )}
          </div>

          {/* Other players */}
          {others.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-purple mb-4">גם השתתפו</h3>
              <PlayerList players={others} showScores />
            </div>
          )}
        </div>

        {/* Play Again */}
        <div className="text-center">
          <button
            onClick={onResetGame}
            className="btn-secondary text-xl px-8 py-4"
          >
            משחק חדש?
          </button>
        </div>
      </div>
    </div>
  );
}
