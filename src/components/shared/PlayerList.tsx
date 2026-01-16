'use client';

import { Player } from '@/types/game';

interface PlayerListProps {
  players: Player[];
  showScores?: boolean;
  highlightId?: string;
}

export function PlayerList({ players, showScores = false, highlightId }: PlayerListProps) {
  const sortedPlayers = showScores
    ? [...players].sort((a, b) => b.score - a.score)
    : players;

  return (
    <div className="space-y-2">
      {sortedPlayers.map((player, index) => (
        <div
          key={player.id}
          className={`
            flex items-center justify-between p-3 rounded-lg
            transition-all duration-300
            ${player.id === highlightId ? 'bg-gold/30 scale-105' : 'bg-white/50'}
            ${!player.isConnected ? 'opacity-50' : ''}
            ${player.isJudge ? 'border-2 border-gold' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {showScores && (
              <span className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold
                ${index === 0 ? 'bg-gold text-purple-dark' :
                  index === 1 ? 'bg-gray-300 text-gray-700' :
                  index === 2 ? 'bg-amber-600 text-white' : 'bg-purple/20 text-purple'}
              `}>
                {index + 1}
              </span>
            )}
            <div>
              <span className="font-semibold text-purple-dark">
                {player.name}
                {player.isJudge && (
                  <span className="ml-2 text-xs bg-gold text-purple-dark px-2 py-0.5 rounded-full">
                    Birthday Judge
                  </span>
                )}
              </span>
              {!player.isConnected && (
                <span className="ml-2 text-xs text-red-500">(disconnected)</span>
              )}
            </div>
          </div>
          {showScores && (
            <span className="font-bold text-gold text-xl">
              {player.score}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
