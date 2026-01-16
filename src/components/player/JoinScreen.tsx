'use client';

import { useState } from 'react';
import { BirthdayBanner } from '../shared/BirthdayBanner';
import { JUDGE_NAME } from '@/types/game';

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
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await onJoin(name.trim());

    if (!result.success) {
      setError(result.error || 'Failed to join');
      setIsLoading(false);
    }
  };

  const isEran = name.toLowerCase() === JUDGE_NAME.toLowerCase();

  return (
    <div className="min-h-screen gradient-bg flex flex-col p-4">
      <BirthdayBanner />

      <div className="flex-1 flex items-center justify-center">
        <div className="card w-full max-w-md">
          <h2 className="text-2xl font-bold text-purple text-center mb-6">
            Join the Game
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-purple mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="input-field text-lg"
                disabled={isLoading}
                autoFocus
                autoComplete="off"
              />
            </div>

            {isEran && (
              <div className="bg-gold/20 p-3 rounded-lg border border-gold">
                <p className="text-sm text-purple-dark font-medium">
                  &#127881; Welcome, birthday VIP! You&apos;ll be the judge for all rounds!
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
              {isLoading ? 'Joining...' : isEran ? 'Join as Judge!' : 'Join Game'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
