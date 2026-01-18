'use client';

import { Player } from '@/types/game';
import { PlayerList } from '../shared/PlayerList';
import { BirthdayBanner } from '../shared/BirthdayBanner';

interface LobbyScreenProps {
  players: Player[];
  onStartGame: () => void;
}

export function LobbyScreen({ players, onStartGame }: LobbyScreenProps) {
  const activePlayers = players.filter(p => p.isConnected && !p.isJudge);
  const judge = players.find(p => p.isJudge);
  const canStart = activePlayers.length >= 2;

  return (
    <div className="min-h-screen gradient-bg p-8" dir="rtl">
      <BirthdayBanner />

      <div className="max-w-4xl mx-auto mt-8">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple mb-2">הצטרפו למשחק!</h2>
            <div className="bg-purple/10 rounded-xl p-6 inline-block">
              <p className="text-lg text-purple-dark mb-2">בטלפון, גשו ל:</p>
              <p className="text-4xl font-mono font-bold text-gold" dir="ltr">
                {typeof window !== 'undefined' ? window.location.origin : ''}/play
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-purple mb-4">
                שחקנים ({activePlayers.length})
              </h3>
              {activePlayers.length === 0 ? (
                <p className="text-purple/60 italic">ממתינים לשחקנים שיצטרפו...</p>
              ) : (
                <PlayerList players={activePlayers} />
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-purple mb-4">שופט יום ההולדת</h3>
              {judge ? (
                <div className="bg-gold/20 p-4 rounded-lg border-2 border-gold">
                  <p className="text-2xl font-bold text-purple-dark">{judge.name}</p>
                  <p className="text-sm text-purple/70">מוכן לשפוט!</p>
                </div>
              ) : (
                <div className="bg-purple/10 p-4 rounded-lg border-2 border-dashed border-purple/30">
                  <p className="text-purple/60">ממתינים לערן שיצטרף כשופט...</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className="btn-primary text-2xl px-12 py-4"
            >
              {canStart ? 'התחל משחק!' : `צריך עוד ${2 - activePlayers.length} שחקנים`}
            </button>
            {!judge && canStart && (
              <p className="mt-2 text-amber-600 text-sm">
                הערה: המשחק יכול להתחיל בלי שופט, אבל ערן צריך להצטרף כדי לבחור מנצחים!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
