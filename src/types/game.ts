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
}

export interface Caption {
  playerId: string;
  playerName: string;
  text: string;
  submittedAt: number;
}

export interface Round {
  number: number;
  type: RoundType;
  imageUrl: string;
  imageCaption?: string; // Optional context for the image
  captions: Caption[];
  winningCaption?: Caption;
  points: number;
  timeRemaining: number;
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
  'reset-game': () => void;
  'reconnect': (playerId: string, callback: (response: { success: boolean; error?: string }) => void) => void;
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

export const CAPTION_TIME_SECONDS = 60;
export const JUDGE_NAME = 'Eran';
