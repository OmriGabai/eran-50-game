'use client';

import { Round, Player, GamePhase } from '@/types/game';
import { MemeImage } from '../shared/MemeImage';

interface ResultsViewProps {
  phase: GamePhase;
  round: Round | null;
  player: Player;
  players: Player[];
}

// Helper to split caption into top/bottom text
function splitCaption(text: string): { topText?: string; bottomText?: string } {
  if (!text) return {};
  const lines = text.split('\n');
  if (lines.length >= 2) {
    return { topText: lines[0], bottomText: lines.slice(1).join('\n') };
  }
  return { bottomText: text };
}

export function ResultsView({ phase, round, player, players }: ResultsViewProps) {
  const sortedPlayers = [...players]
    .filter(p => !p.isJudge)
    .sort((a, b) => b.score - a.score);
  const playerRank = sortedPlayers.findIndex(p => p.id === player.id) + 1;
  const isWinner = round?.winningCaption?.playerId === player.id;

  if (phase === 'reveal') {
    return (
      <div className="min-h-screen gradient-bg flex flex-col p-4" dir="rtl">
        <div className="card flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">{'\u{1F440}'}</div>
            <h2 className="text-xl font-bold text-purple">
              תסתכל על המסך!
            </h2>
            <p className="text-purple/60 mt-2">
              הכיתובים נחשפים...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'judging') {
    return (
      <div className="min-h-screen gradient-bg flex flex-col p-4" dir="rtl">
        <div className="card flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">{'\u{1F91E}'}</div>
            <h2 className="text-xl font-bold text-purple">
              אצבעות משולבות!
            </h2>
            <p className="text-purple/60 mt-2">
              ערן בוחר מנצח...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'winner' && round) {
    const winningCaption = round.winningCaption;
    const { topText, bottomText } = splitCaption(winningCaption?.text || '');

    return (
      <div className="min-h-screen gradient-bg flex flex-col p-4" dir="rtl">
        <div className="card flex-1 flex flex-col items-center justify-center">
          {isWinner ? (
            <>
              <div className="text-7xl mb-4">{'\u{1F3C6}'}</div>
              <h2 className="text-3xl font-bold text-gold mb-2">
                ניצחת!
              </h2>
              <p className="text-2xl text-purple font-bold">
                +{round.points}{winningCaption?.speedBonus ? ` (+${winningCaption.speedBonus} בונוס)` : ''} נקודות!
              </p>
              {winningCaption?.imageUrl && (
                <div className="mt-4 w-full max-w-md">
                  <MemeImage
                    imageUrl={winningCaption.imageUrl}
                    topText={topText}
                    bottomText={bottomText}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">{'\u{1F44F}'}</div>
              <h2 className="text-xl font-bold text-purple mb-2">
                מנצח: {winningCaption?.playerName}
              </h2>
              {winningCaption?.imageUrl && (
                <div className="w-full max-w-md">
                  <MemeImage
                    imageUrl={winningCaption.imageUrl}
                    topText={topText}
                    bottomText={bottomText}
                  />
                </div>
              )}
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-purple/60">הניקוד שלך</p>
            <p className="text-3xl font-bold text-gold">{player.score}</p>
            <p className="text-sm text-purple/60">דירוג: #{playerRank}</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'round-start' && round) {
    const roundTypeHebrew = {
      normal: 'רגיל',
      roast: 'צליה',
      tribute: 'מחווה'
    };

    return (
      <div className="min-h-screen gradient-bg flex flex-col p-4" dir="rtl">
        <div className="card flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">{'\u{1F389}'}</div>
            <h2 className="text-2xl font-bold title-text mb-2">
              סיבוב {round.number}
            </h2>
            <p className="text-lg text-purple/70">
              {roundTypeHebrew[round.type]} - התכוננו לכתוב!
            </p>
            <div className="mt-4">
              <span className="bg-gold/20 text-gold px-4 py-2 rounded-full font-bold">
                {round.points} נקודות
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default view
  return (
    <div className="min-h-screen gradient-bg flex flex-col p-4" dir="rtl">
      <div className="card flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-purple/60 mb-1">הניקוד שלך</p>
          <p className="text-5xl font-bold text-gold mb-2">{player.score}</p>
          <p className="text-purple/60">דירוג: #{playerRank}</p>
        </div>
      </div>
    </div>
  );
}
