'use client';

import { useState } from 'react';
import { Round, Player } from '@/types/game';
import { Timer } from '../shared/Timer';
import { MemeImage } from '../shared/MemeImage';
import { CAPTION_TIME_SECONDS, MAX_SWAPS_PER_ROUND } from '@/types/game';

interface CaptionInputProps {
  round: Round;
  player: Player;
  timeRemaining: number;
  onSubmit: (text: string) => void;
  onSwapImage: () => Promise<{ success: boolean; error?: string }>;
}

export function CaptionInput({ round, player, timeRemaining, onSubmit, onSwapImage }: CaptionInputProps) {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);

  // Use player's assigned image or fallback to round image
  const imageUrl = player.currentImageUrl || round.imageUrl;

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

  const handleSwap = async () => {
    if (isSwapping || player.swapsRemaining <= 0) return;

    setIsSwapping(true);
    setSwapError(null);

    const result = await onSwapImage();

    if (!result.success && result.error) {
      setSwapError(result.error);
    }

    setIsSwapping(false);
  };

  const hasContent = topText.trim() || bottomText.trim();
  const totalLength = topText.length + bottomText.length;

  // Calculate speed bonus indicator
  const getSpeedBonusText = () => {
    if (timeRemaining >= 90) return '+50% בונוס מהירות!';
    if (timeRemaining >= 60) return '+25% בונוס מהירות';
    if (timeRemaining >= 30) return '+10% בונוס מהירות';
    return '';
  };

  if (player.hasSubmitted || isSubmitted) {
    return (
      <div className="min-h-screen min-h-[100dvh] gradient-bg flex flex-col p-4 safe-area-top safe-area-bottom" dir="rtl">
        <div className="flex-1 flex items-center justify-center">
          <div className="card w-full max-w-md text-center">
            <div className="text-6xl mb-4">{'\u{2705}'}</div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              הכיתוב נשלח!
            </h2>
            <p className="text-purple/60 mb-4">
              ממתינים לשאר השחקנים...
            </p>
            {imageUrl && (
              <MemeImage
                imageUrl={imageUrl}
                topText={topText.trim()}
                bottomText={bottomText.trim()}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  const roundTypeHebrew = {
    normal: 'רגיל',
    roast: 'צליה',
    tribute: 'מחווה'
  };

  return (
    <div className="min-h-screen min-h-[100dvh] gradient-bg flex flex-col p-3 sm:p-4 safe-area-top safe-area-bottom" dir="rtl">
      {/* Timer */}
      <div className="mb-2">
        <Timer seconds={timeRemaining} maxSeconds={CAPTION_TIME_SECONDS} />
      </div>

      {/* Speed bonus indicator */}
      {getSpeedBonusText() && (
        <div className="text-center mb-1">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            {getSpeedBonusText()}
          </span>
        </div>
      )}

      {/* Round info */}
      <div className="text-center mb-2">
        <span className="bg-purple/10 text-purple px-3 py-1 rounded-full text-sm font-medium">
          סיבוב {round.number} - {roundTypeHebrew[round.type]}
        </span>
        <span className="mr-2 text-gold font-bold">{round.points} נק׳</span>
      </div>

      {/* Live meme preview with swap button */}
      <div className="card p-2 mb-2">
        {imageUrl && (
          <MemeImage
            imageUrl={imageUrl}
            topText={topText || undefined}
            bottomText={bottomText || undefined}
          />
        )}

        {/* Swap button */}
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSwap}
            disabled={isSwapping || player.swapsRemaining <= 0}
            className="text-sm px-3 py-1.5 rounded-lg bg-purple/10 text-purple hover:bg-purple/20
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
            {isSwapping ? (
              <span className="animate-spin">{'\u{1F504}'}</span>
            ) : (
              <span>{'\u{1F501}'}</span>
            )}
            החלף תמונה ({player.swapsRemaining}/{MAX_SWAPS_PER_ROUND})
          </button>

          {swapError && (
            <span className="text-red-500 text-xs">{swapError}</span>
          )}
        </div>
      </div>

      {/* Caption inputs */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {/* Top text input */}
        <div>
          <label className="text-xs text-purple/60 font-medium mb-1 block px-1">
            טקסט עליון
          </label>
          <input
            type="text"
            value={topText}
            onChange={(e) => setTopText(e.target.value.toUpperCase())}
            placeholder="טקסט עליון (אופציונלי)"
            className="input-field text-base uppercase text-right"
            maxLength={100}
            autoFocus
            dir="rtl"
          />
        </div>

        {/* Bottom text input */}
        <div>
          <label className="text-xs text-purple/60 font-medium mb-1 block px-1">
            טקסט תחתון
          </label>
          <input
            type="text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value.toUpperCase())}
            placeholder="טקסט תחתון (אופציונלי)"
            className="input-field text-base uppercase text-right"
            maxLength={100}
            dir="rtl"
          />
        </div>

        <div className="text-left text-xs text-purple/50 px-1">
          {totalLength}/200
        </div>

        <button
          type="submit"
          disabled={!hasContent}
          className="btn-primary text-lg sm:text-xl py-4 mt-1"
        >
          שלח כיתוב
        </button>
      </form>
    </div>
  );
}
