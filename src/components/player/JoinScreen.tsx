'use client';

import { useState } from 'react';
import { BirthdayBanner } from '../shared/BirthdayBanner';
import { isJudgeName } from '@/types/game';

interface JoinScreenProps {
  onJoin: (name: string) => Promise<{ success: boolean; error?: string }>;
}

export function JoinScreen({ onJoin }: JoinScreenProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('נא להזין שם');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await onJoin(name.trim());

    if (!result.success) {
      setError(result.error || 'ההצטרפות נכשלה');
      setIsLoading(false);
    }
  };

  const isJudge = isJudgeName(name);

  return (
    <div className="min-h-screen gradient-bg flex flex-col p-4" dir="rtl">
      <BirthdayBanner />

      <div className="flex-1 flex items-center justify-center">
        <div className="card w-full max-w-md">
          <h2 className="text-2xl font-bold text-purple text-center mb-6">
            הצטרף למשחק
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-purple mb-1">
                השם שלך
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="הכנס את שמך"
                className="input-field text-lg text-right"
                disabled={isLoading}
                autoFocus
                autoComplete="off"
                dir="rtl"
              />
            </div>

            {isJudge && (
              <div className="bg-gold/20 p-3 rounded-lg border border-gold">
                <p className="text-sm text-purple-dark font-medium">
                  {'\u{1F389}'} ברוך הבא, VIP יום הולדת! אתה תהיה השופט לכל הסיבובים!
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="btn-primary w-full text-xl"
            >
              {isLoading ? 'מצטרף...' : isJudge ? 'הצטרף כשופט!' : 'הצטרף למשחק'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
