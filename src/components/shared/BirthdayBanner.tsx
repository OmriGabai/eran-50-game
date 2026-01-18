'use client';

interface BirthdayBannerProps {
  compact?: boolean;
}

export function BirthdayBanner({ compact = false }: BirthdayBannerProps) {
  if (compact) {
    return (
      <div className="text-center py-2" dir="rtl">
        <h1 className="text-xl font-bold title-text flex items-center justify-center gap-2">
          <span>{'\u{1F389}'}</span>
          <span>ערן בן 50!</span>
          <span>{'\u{1F389}'}</span>
        </h1>
      </div>
    );
  }

  return (
    <div className="text-center py-4 safe-area-top" dir="rtl">
      <div className="flex justify-center gap-3 mb-2">
        <span className="text-3xl md:text-4xl animate-bounce" style={{ animationDelay: '0ms' }}>{'\u{1F389}'}</span>
        <span className="text-3xl md:text-4xl animate-bounce" style={{ animationDelay: '100ms' }}>{'\u{1F382}'}</span>
        <span className="text-3xl md:text-4xl animate-bounce" style={{ animationDelay: '200ms' }}>{'\u{1F389}'}</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold title-text px-4">
        מסיבת יום הולדת 50 לערן!
      </h1>
      <p className="text-white/60 mt-2 text-sm sm:text-base">
        עשה את זה מם
      </p>
    </div>
  );
}
