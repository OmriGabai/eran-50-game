'use client';

interface TimerProps {
  seconds: number;
  maxSeconds?: number;
}

export function Timer({ seconds, maxSeconds = 60 }: TimerProps) {
  const percentage = (seconds / maxSeconds) * 100;
  const isUrgent = seconds <= 10;
  const isCritical = seconds <= 5;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-10 sm:h-8 bg-white/50 rounded-full overflow-hidden border-2 border-gold/30 shadow-inner">
        <div
          className={`
            h-full transition-all duration-1000 ease-linear rounded-full
            ${isCritical ? 'bg-red-600' : isUrgent ? 'bg-orange-500' : 'bg-gradient-to-r from-gold to-gold-dark'}
            ${isUrgent ? 'animate-pulse' : ''}
          `}
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`
            font-bold text-xl sm:text-lg tabular-nums
            ${isCritical ? 'text-red-700 scale-110' : isUrgent ? 'text-orange-700' : 'text-purple-dark'}
            transition-all duration-200
          `}>
            {seconds}s
          </span>
        </div>
      </div>
    </div>
  );
}
