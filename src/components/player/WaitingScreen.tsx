'use client';

import { Player } from '@/types/game';
import { BirthdayBanner } from '../shared/BirthdayBanner';
import { PlayerList } from '../shared/PlayerList';

interface WaitingScreenProps {
  players: Player[];
  currentPlayer: Player;
}

export function WaitingScreen({ players, currentPlayer }: WaitingScreenProps) {
  return (
    <div className="min-h-screen gradient-bg flex flex-col p-4" dir="rtl">
      <BirthdayBanner />

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="card w-full">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{'\u{1F44B}'}</div>
            <h2 className="text-2xl font-bold text-purple">
              ברוך הבא, {currentPlayer.name}!
            </h2>
            {currentPlayer.isJudge ? (
              <p className="text-gold font-medium mt-2">
                אתה שופט יום ההולדת! {'\u{1F389}'}
              </p>
            ) : (
              <p className="text-purple/60 mt-2">
                ממתינים למנחה שיתחיל...
              </p>
            )}
          </div>

          <div className="bg-purple/5 rounded-lg p-4">
            <h3 className="text-sm font-bold text-purple mb-3">
              שחקנים בלובי ({players.length})
            </h3>
            <PlayerList players={players} highlightId={currentPlayer.id} />
          </div>
        </div>

        <div className="mt-4 text-center text-purple/50 text-sm">
          השאר את המסך פתוח!
        </div>
      </div>
    </div>
  );
}
