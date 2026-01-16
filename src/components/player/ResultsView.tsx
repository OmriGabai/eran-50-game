'use client';

import { Round, Player, GamePhase } from '@/types/game';

interface ResultsViewProps {
  phase: GamePhase;
  round: Round | null;
  player: Player;
  players: Player[];
}

export function ResultsView({ phase, round, player, players }: ResultsViewProps) {
  const sortedPlayers = [...players]
    .filter(p => !p.isJudge)
    .sort((a, b) => b.score - a.score);
  const playerRank = sortedPlayers.findIndex(p => p.id === player.id) + 1;
  const isWinner = round?.winningCaption?.playerId === player.id;

  if (phase === 'reveal') {
    return (
      <div className="min-h-screen gradient-bg flex flex-col p-4">
        <div className="card flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">&#128064;</div>
            <h2 className="text-xl font-bold text-purple">
              Watch the TV!
            </h2>
            <p className="text-purple/60 mt-2">
              Captions are being revealed...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'judging') {
    return (
      <div className="min-h-screen gradient-bg flex flex-col p-4">
        <div className="card flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">&#129310;</div>
            <h2 className="text-xl font-bold text-purple">
              Fingers crossed!
            </h2>
            <p className="text-purple/60 mt-2">
              Eran is picking a winner...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'winner' && round) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col p-4">
        <div className="card flex-1 flex flex-col items-center justify-center">
          {isWinner ? (
            <>
              <div className="text-7xl mb-4">&#127942;</div>
              <h2 className="text-3xl font-bold text-gold mb-2">
                You Won!
              </h2>
              <p className="text-2xl text-purple font-bold">
                +{round.points} points!
              </p>
              <div className="mt-4 bg-gold/10 p-4 rounded-lg">
                <p className="text-purple-dark italic">
                  &quot;{round.winningCaption?.text}&quot;
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">&#128079;</div>
              <h2 className="text-xl font-bold text-purple mb-2">
                Winner: {round.winningCaption?.playerName}
              </h2>
              <div className="bg-purple/10 p-4 rounded-lg">
                <p className="text-purple-dark italic">
                  &quot;{round.winningCaption?.text}&quot;
                </p>
              </div>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-purple/60">Your score</p>
            <p className="text-3xl font-bold text-gold">{player.score}</p>
            <p className="text-sm text-purple/60">Rank: #{playerRank}</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'round-start' && round) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col p-4">
        <div className="card flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">&#127881;</div>
            <h2 className="text-2xl font-bold title-text mb-2">
              Round {round.number}
            </h2>
            <p className="text-lg text-purple/70">
              Get ready to caption!
            </p>
            <div className="mt-4">
              <span className="bg-gold/20 text-gold px-4 py-2 rounded-full font-bold">
                {round.points} points
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default view
  return (
    <div className="min-h-screen gradient-bg flex flex-col p-4">
      <div className="card flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-purple/60 mb-1">Your score</p>
          <p className="text-5xl font-bold text-gold mb-2">{player.score}</p>
          <p className="text-purple/60">Rank: #{playerRank}</p>
        </div>
      </div>
    </div>
  );
}
