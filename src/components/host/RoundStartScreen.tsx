'use client';

import { Round, RoundType } from '@/types/game';

interface RoundStartScreenProps {
  round: Round;
}

const roundTypeLabels: Record<RoundType, { title: string; description: string; emoji: string }> = {
  normal: { title: 'כתבו כיתוב!', description: 'תעשו את זה מצחיק!', emoji: '\u{1F602}' },
  roast: { title: 'סיבוב צליה!', description: 'תמונה אישית - תהיו אכזריים!', emoji: '\u{1F525}' },
  tribute: { title: 'סיבוב מחווה', description: 'תראו קצת אהבה לחוגג!', emoji: '\u{2764}\u{FE0F}' },
};

export function RoundStartScreen({ round }: RoundStartScreenProps) {
  const typeInfo = roundTypeLabels[round.type];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8" dir="rtl">
      <div className="text-center animate-fade-in">
        <div className="text-8xl mb-4">{typeInfo.emoji}</div>

        <h1 className="text-6xl font-bold text-purple mb-4">
          סיבוב {round.number}
        </h1>

        <h2 className="text-4xl font-bold title-text mb-4">
          {typeInfo.title}
        </h2>

        <p className="text-2xl text-purple/70 mb-8">
          {typeInfo.description}
        </p>

        <div className="inline-block bg-gold/20 px-6 py-3 rounded-full">
          <span className="text-xl font-bold text-gold">
            {round.points} נקודות על הכף!
          </span>
        </div>
      </div>
    </div>
  );
}
