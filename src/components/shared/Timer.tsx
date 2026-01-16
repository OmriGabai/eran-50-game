'use client';

interface TimerProps {
  seconds: number;
  maxSeconds?: number;
}

export function Timer({ seconds, maxSeconds = 60 }: TimerProps) {
  const percentage = (seconds / maxSeconds) * 100;
  const isUrgent = seconds <= 10;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-8 bg-white/50 rounded-full overflow-hidden border-2 border-gold/30">
        <div
          className={`
            h-full transition-all duration-1000 ease-linear
            ${isUrgent ? 'bg-red-500 animate-pulse' : 'bg-gold'}
          `}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`
            font-bold text-lg
            ${isUrgent ? 'text-red-700' : 'text-purple-dark'}
          `}>
            {seconds}s
          </span>
        </div>
      </div>
    </div>
  );
}
