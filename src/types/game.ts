// Game types for Eran's 50th Birthday Meme Game

export type GamePhase =
  | 'lobby'
  | 'round-start'
  | 'caption'
  | 'reveal'
  | 'judging'
  | 'winner'
  | 'game-over';

export type RoundType = 'normal' | 'roast' | 'tribute';

export interface Player {
  id: string;
  name: string;
  score: number;
  isJudge: boolean;
  isConnected: boolean;
  hasSubmitted: boolean;
  swapsRemaining: number; // Image swaps remaining this round
  currentImageUrl?: string; // Player's assigned image for this round
}

export interface Caption {
  playerId: string;
  playerName: string;
  text: string;
  submittedAt: number;
  imageUrl: string; // The image this caption was written for
  speedBonus: number; // Bonus points for fast submission
}

export interface Round {
  number: number;
  type: RoundType;
  imageUrl: string; // Default/fallback image
  imageCaption?: string; // Optional context for the image
  captions: Caption[];
  winningCaption?: Caption;
  points: number;
  timeRemaining: number;
  startedAt: number; // Timestamp when caption phase started
}

export interface GameImage {
  id: string;
  url: string;
  caption?: string;
  roundType: RoundType;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentRound: Round | null;
  roundNumber: number;
  totalRounds: number;
  images: GameImage[];
  revealIndex: number; // For dramatic reveal, which caption is being shown
}

// Socket Events
export interface ServerToClientEvents {
  'game-state': (state: GameState) => void;
  'player-joined': (player: Player) => void;
  'player-left': (playerId: string) => void;
  'caption-submitted': (playerId: string) => void;
  'timer-tick': (timeRemaining: number) => void;
  'reveal-caption': (index: number) => void;
  'winner-selected': (caption: Caption) => void;
  'image-swapped': (playerId: string, newImageUrl: string, swapsRemaining: number) => void;
  'error': (message: string) => void;
}

export interface ClientToServerEvents {
  'join': (name: string, callback: (response: { success: boolean; playerId?: string; error?: string }) => void) => void;
  'submit-caption': (text: string) => void;
  'select-winner': (playerId: string) => void;
  'start-game': () => void;
  'next-reveal': () => void;
  'start-judging': () => void;
  'next-round': () => void;
  'end-game': () => void;
  'reset-game': () => void;
  'reconnect': (playerId: string, callback: (response: { success: boolean; error?: string }) => void) => void;
  'swap-image': (callback: (response: { success: boolean; newImageUrl?: string; swapsRemaining?: number; error?: string }) => void) => void;
}

// Round configuration
export const ROUND_CONFIG: { type: RoundType; points: number }[] = [
  { type: 'normal', points: 100 },
  { type: 'normal', points: 100 },
  { type: 'roast', points: 150 },
  { type: 'normal', points: 100 },
  { type: 'roast', points: 150 },
  { type: 'normal', points: 100 },
  { type: 'tribute', points: 200 },
];

export const CAPTION_TIME_SECONDS = 120; // 2 minutes per turn
export const MAX_SWAPS_PER_ROUND = 3;
export const JUDGE_NAMES = ['eran', 'ערן', 'פוצקי']; // Accepted judge names (case-insensitive)

// Speed bonus thresholds (based on time remaining)
export const SPEED_BONUS = {
  FAST: { minTimeRemaining: 90, bonus: 0.5 },    // First 30s: +50%
  MEDIUM: { minTimeRemaining: 60, bonus: 0.25 }, // 30-60s: +25%
  SLOW: { minTimeRemaining: 30, bonus: 0.1 },    // 60-90s: +10%
  // After 90s: no bonus
};

export function isJudgeName(name: string): boolean {
  return JUDGE_NAMES.includes(name.toLowerCase());
}
