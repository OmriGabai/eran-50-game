'use client';

interface BirthdayBannerProps {
  compact?: boolean;
}

export function BirthdayBanner({ compact = false }: BirthdayBannerProps) {
  if (compact) {
    return (
      <div className="text-center py-2">
        <h1 className="text-xl font-bold title-text flex items-center justify-center gap-2">
          <span>{'\u{1F389}'}</span>
          <span>Eran&apos;s 50th</span>
          <span>{'\u{1F389}'}</span>
        </h1>
      </div>
    );
  }

  return (
    <div className="text-center py-4 safe-area-top">
      <div className="flex justify-center gap-3 mb-2">
        <span className="text-3xl md:text-4xl animate-bounce" style={{ animationDelay: '0ms' }}>{'\u{1F389}'}</span>
        <span className="text-3xl md:text-4xl animate-bounce" style={{ animationDelay: '100ms' }}>{'\u{1F382}'}</span>
        <span className="text-3xl md:text-4xl animate-bounce" style={{ animationDelay: '200ms' }}>{'\u{1F389}'}</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold title-text px-4">
        Eran&apos;s 50th Birthday Bash!
      </h1>
      <p className="text-purple/60 mt-2 text-sm sm:text-base">
        Make It Meme
      </p>
    </div>
  );
}
