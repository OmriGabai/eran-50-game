'use client';

import { Round, Player } from '@/types/game';
import { Timer } from '../shared/Timer';
import { CAPTION_TIME_SECONDS } from '@/types/game';

interface CaptionScreenProps {
  round: Round;
  players: Player[];
  timeRemaining: number;
}

export function CaptionScreen({ round, players, timeRemaining }: CaptionScreenProps) {
  const activePlayers = players.filter(p => p.isConnected && !p.isJudge);
  const submittedCount = activePlayers.filter(p => p.hasSubmitted).length;

  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-purple">
            Round {round.number} - {round.type.toUpperCase()}
          </div>
          <div className="bg-gold/20 px-4 py-2 rounded-full">
            <span className="font-bold text-gold">{round.points} pts</span>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-8">
          <Timer seconds={timeRemaining} maxSeconds={CAPTION_TIME_SECONDS} />
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Image */}
          <div className="lg:col-span-2">
            <div className="card p-4">
              <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                {round.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={round.imageUrl}
                    alt="Caption this!"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400 text-xl">Image loading...</span>
                  </div>
                )}
              </div>
              {round.imageCaption && (
                <p className="mt-2 text-center text-purple/60 italic">
                  {round.imageCaption}
                </p>
              )}
            </div>
          </div>

          {/* Submission status */}
          <div className="card">
            <h3 className="text-xl font-bold text-purple mb-4">Submissions</h3>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gold">
                {submittedCount}/{activePlayers.length}
              </div>
              <p className="text-purple/60">players submitted</p>
            </div>

            <div className="space-y-2">
              {activePlayers.map(player => (
                <div
                  key={player.id}
                  className={`
                    flex items-center justify-between p-2 rounded-lg
                    ${player.hasSubmitted ? 'bg-green-100' : 'bg-gray-100'}
                  `}
                >
                  <span className="font-medium text-purple-dark">{player.name}</span>
                  {player.hasSubmitted ? (
                    <span className="text-green-600">&#10003;</span>
                  ) : (
                    <span className="text-gray-400">...</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
