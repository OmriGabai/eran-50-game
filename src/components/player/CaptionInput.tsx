'use client';

import { useState } from 'react';
import { Round, Player } from '@/types/game';
import { Timer } from '../shared/Timer';
import { CAPTION_TIME_SECONDS } from '@/types/game';

interface CaptionInputProps {
  round: Round;
  player: Player;
  timeRemaining: number;
  onSubmit: (text: string) => void;
}

export function CaptionInput({ round, player, timeRemaining, onSubmit }: CaptionInputProps) {
  const [caption, setCaption] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || isSubmitted) return;

    onSubmit(caption.trim());
    setIsSubmitted(true);
  };

  if (player.hasSubmitted || isSubmitted) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="card w-full max-w-md text-center">
            <div className="text-6xl mb-4">&#10003;</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Caption Submitted!
            </h2>
            <p className="text-purple/60 mb-4">
              Waiting for other players...
            </p>
            <div className="bg-gold/10 p-4 rounded-lg">
              <p className="text-purple-dark italic">&quot;{caption}&quot;</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col p-4">
      {/* Timer */}
      <div className="mb-4">
        <Timer seconds={timeRemaining} maxSeconds={CAPTION_TIME_SECONDS} />
      </div>

      {/* Round info */}
      <div className="text-center mb-4">
        <span className="bg-purple/10 text-purple px-3 py-1 rounded-full text-sm font-medium">
          Round {round.number} - {round.type.toUpperCase()}
        </span>
        <span className="ml-2 text-gold font-bold">{round.points} pts</span>
      </div>

      {/* Image thumbnail */}
      <div className="card p-2 mb-4">
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
              <span className="text-gray-400">Loading image...</span>
            </div>
          )}
        </div>
      </div>

      {/* Caption input */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write your caption here..."
            className="input-field h-32 resize-none text-lg"
            maxLength={200}
            autoFocus
          />
          <div className="text-right text-sm text-purple/50 mt-1">
            {caption.length}/200
          </div>
        </div>

        <button
          type="submit"
          disabled={!caption.trim()}
          className="btn-primary text-xl mt-4"
        >
          Submit Caption
        </button>
      </form>
    </div>
  );
}
