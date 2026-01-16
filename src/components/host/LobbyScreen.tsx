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
    <div className="min-h-screen gradient-bg p-8">
      <BirthdayBanner />

      <div className="max-w-4xl mx-auto mt-8">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple mb-2">Join the Game!</h2>
            <div className="bg-purple/10 rounded-xl p-6 inline-block">
              <p className="text-lg text-purple-dark mb-2">On your phone, go to:</p>
              <p className="text-4xl font-mono font-bold text-gold">
                {typeof window !== 'undefined' ? window.location.origin : ''}/play
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-purple mb-4">
                Players ({activePlayers.length})
              </h3>
              {activePlayers.length === 0 ? (
                <p className="text-purple/60 italic">Waiting for players to join...</p>
              ) : (
                <PlayerList players={activePlayers} />
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-purple mb-4">Birthday Judge</h3>
              {judge ? (
                <div className="bg-gold/20 p-4 rounded-lg border-2 border-gold">
                  <p className="text-2xl font-bold text-purple-dark">{judge.name}</p>
                  <p className="text-sm text-purple/70">Ready to judge!</p>
                </div>
              ) : (
                <div className="bg-purple/10 p-4 rounded-lg border-2 border-dashed border-purple/30">
                  <p className="text-purple/60">Waiting for Eran to join as judge...</p>
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
              {canStart ? 'Start Game!' : `Need ${2 - activePlayers.length} more players`}
            </button>
            {!judge && canStart && (
              <p className="mt-2 text-amber-600 text-sm">
                Note: Game can start without judge, but Eran should join to pick winners!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
