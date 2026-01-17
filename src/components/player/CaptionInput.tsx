'use client';

import { useState } from 'react';
import { Round, Player } from '@/types/game';
import { Timer } from '../shared/Timer';
import { MemeImage } from '../shared/MemeImage';
import { CAPTION_TIME_SECONDS } from '@/types/game';

interface CaptionInputProps {
  round: Round;
  player: Player;
  timeRemaining: number;
  onSubmit: (text: string) => void;
}

export function CaptionInput({ round, player, timeRemaining, onSubmit }: CaptionInputProps) {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!topText.trim() && !bottomText.trim()) || isSubmitted) return;

    // Combine top and bottom with newline (splitCaption will parse this)
    const caption = topText.trim() && bottomText.trim()
      ? `${topText.trim()}\n${bottomText.trim()}`
      : topText.trim() || bottomText.trim();

    onSubmit(caption);
    setIsSubmitted(true);
  };

  const hasContent = topText.trim() || bottomText.trim();
  const totalLength = topText.length + bottomText.length;

  if (player.hasSubmitted || isSubmitted) {
    return (
      <div className="min-h-screen min-h-[100dvh] gradient-bg flex flex-col p-4 safe-area-top safe-area-bottom">
        <div className="flex-1 flex items-center justify-center">
          <div className="card w-full max-w-md text-center">
            <div className="text-6xl mb-4">{'\u{2705}'}</div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Caption Submitted!
            </h2>
            <p className="text-purple/60 mb-4">
              Waiting for other players...
            </p>
            {round.imageUrl && (
              <MemeImage
                imageUrl={round.imageUrl}
                topText={topText.trim()}
                bottomText={bottomText.trim()}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] gradient-bg flex flex-col p-3 sm:p-4 safe-area-top safe-area-bottom">
      {/* Timer */}
      <div className="mb-2">
        <Timer seconds={timeRemaining} maxSeconds={CAPTION_TIME_SECONDS} />
      </div>

      {/* Round info */}
      <div className="text-center mb-2">
        <span className="bg-purple/10 text-purple px-3 py-1 rounded-full text-sm font-medium">
          Round {round.number} - {round.type.toUpperCase()}
        </span>
        <span className="ml-2 text-gold font-bold">{round.points} pts</span>
      </div>

      {/* Live meme preview */}
      <div className="card p-2 mb-2">
        {round.imageUrl && (
          <MemeImage
            imageUrl={round.imageUrl}
            topText={topText || undefined}
            bottomText={bottomText || undefined}
          />
        )}
      </div>

      {/* Caption inputs */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {/* Top text input */}
        <div>
          <label className="text-xs text-purple/60 font-medium mb-1 block px-1">
            TOP TEXT
          </label>
          <input
            type="text"
            value={topText}
            onChange={(e) => setTopText(e.target.value.toUpperCase())}
            placeholder="TOP TEXT (OPTIONAL)"
            className="input-field text-base uppercase"
            maxLength={100}
            autoFocus
          />
        </div>

        {/* Bottom text input */}
        <div>
          <label className="text-xs text-purple/60 font-medium mb-1 block px-1">
            BOTTOM TEXT
          </label>
          <input
            type="text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value.toUpperCase())}
            placeholder="BOTTOM TEXT (OPTIONAL)"
            className="input-field text-base uppercase"
            maxLength={100}
          />
        </div>

        <div className="text-right text-xs text-purple/50 px-1">
          {totalLength}/200
        </div>

        <button
          type="submit"
          disabled={!hasContent}
          className="btn-primary text-lg sm:text-xl py-4 mt-1"
        >
          Submit Caption
        </button>
      </form>
    </div>
  );
}
