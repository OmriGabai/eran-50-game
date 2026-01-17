import { v4 as uuidv4 } from 'uuid';
import {
  GameState,
  Player,
  Caption,
  GameImage,
  ROUND_CONFIG,
  CAPTION_TIME_SECONDS,
  JUDGE_NAME,
} from '../types/game';

type StateChangeCallback = (state: GameState) => void;
type TimerCallback = (time: number) => void;

class GameManager {
  private state: GameState;
  private onStateChange: StateChangeCallback | null = null;
  private onTimerTick: TimerCallback | null = null;
  private timerInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): GameState {
    return {
      phase: 'lobby',
      players: [],
      currentRound: null,
      roundNumber: 0,
      totalRounds: ROUND_CONFIG.length,
      images: [],
      revealIndex: -1,
    };
  }

  setOnStateChange(callback: StateChangeCallback) {
    this.onStateChange = callback;
  }

  setOnTimerTick(callback: TimerCallback) {
    this.onTimerTick = callback;
  }

  private emitState() {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }

  getState(): GameState {
    return { ...this.state };
  }

  // Player Management
  addPlayer(name: string): { success: boolean; playerId?: string; error?: string } {
    // Check if name is already taken
    const existingPlayer = this.state.players.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );

    if (existingPlayer) {
      if (!existingPlayer.isConnected) {
        // Allow reconnection
        existingPlayer.isConnected = true;
        this.emitState();
        return { success: true, playerId: existingPlayer.id };
      }
      return { success: false, error: 'Name already taken' };
    }

    // Check if game has already started
    if (this.state.phase !== 'lobby') {
      return { success: false, error: 'Game already in progress' };
    }

    const isJudge = name.toLowerCase() === JUDGE_NAME.toLowerCase();
    const player: Player = {
      id: uuidv4(),
      name,
      score: 0,
      isJudge,
      isConnected: true,
      hasSubmitted: false,
    };

    this.state.players.push(player);
    this.emitState();
    return { success: true, playerId: player.id };
  }

  removePlayer(playerId: string) {
    const player = this.state.players.find((p) => p.id === playerId);
    if (player) {
      player.isConnected = false;
      this.emitState();
    }
  }

  reconnectPlayer(playerId: string): { success: boolean; error?: string } {
    const player = this.state.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }
    player.isConnected = true;
    this.emitState();
    return { success: true };
  }

  getPlayer(playerId: string): Player | undefined {
    return this.state.players.find((p) => p.id === playerId);
  }

  // Image Management
  setImages(images: GameImage[]) {
    this.state.images = images;
  }

  addImage(image: GameImage) {
    this.state.images.push(image);
  }

  // Game Flow
  startGame(): boolean {
    const activePlayers = this.state.players.filter((p) => p.isConnected && !p.isJudge);
    if (activePlayers.length < 2) {
      return false;
    }

    if (this.state.images.length < ROUND_CONFIG.length) {
      // Use placeholder images if not enough uploaded
      console.warn('Not enough images, using placeholders');
    }

    this.state.roundNumber = 0;
    this.startNextRound();
    return true;
  }

  private startNextRound() {
    this.state.roundNumber++;

    // Get round config - cycle through configs for bonus rounds
    const configIndex = (this.state.roundNumber - 1) % ROUND_CONFIG.length;
    const roundConfig = ROUND_CONFIG[configIndex];

    // Cycle through images for bonus rounds
    const imageIndex = (this.state.roundNumber - 1) % Math.max(this.state.images.length, 1);
    const image = this.state.images[imageIndex];

    // Reset player submission status
    this.state.players.forEach((p) => {
      p.hasSubmitted = false;
    });

    this.state.currentRound = {
      number: this.state.roundNumber,
      type: roundConfig.type,
      imageUrl: image?.url || `/images/meme-templates/placeholder-${this.state.roundNumber}.jpg`,
      imageCaption: image?.caption,
      captions: [],
      points: roundConfig.points,
      timeRemaining: CAPTION_TIME_SECONDS,
    };

    this.state.phase = 'round-start';
    this.state.revealIndex = -1;
    this.emitState();

    // Auto-transition to caption phase after a short delay
    setTimeout(() => {
      this.startCaptionPhase();
    }, 3000);
  }

  private startCaptionPhase() {
    this.state.phase = 'caption';
    this.emitState();
    this.startTimer();
  }

  private startTimer() {
    this.stopTimer();

    this.timerInterval = setInterval(() => {
      if (this.state.currentRound) {
        this.state.currentRound.timeRemaining--;

        if (this.onTimerTick) {
          this.onTimerTick(this.state.currentRound.timeRemaining);
        }

        if (this.state.currentRound.timeRemaining <= 0) {
          this.stopTimer();
          this.startReveal();
        }
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  submitCaption(playerId: string, text: string): boolean {
    if (this.state.phase !== 'caption' || !this.state.currentRound) {
      return false;
    }

    const player = this.state.players.find((p) => p.id === playerId);
    if (!player || player.isJudge || player.hasSubmitted) {
      return false;
    }

    const caption: Caption = {
      playerId,
      playerName: player.name,
      text: text.trim(),
      submittedAt: Date.now(),
    };

    this.state.currentRound.captions.push(caption);
    player.hasSubmitted = true;
    this.emitState();

    // Check if all non-judge players have submitted
    const activePlayers = this.state.players.filter((p) => p.isConnected && !p.isJudge);
    const allSubmitted = activePlayers.every((p) => p.hasSubmitted);

    if (allSubmitted) {
      this.stopTimer();
      setTimeout(() => this.startReveal(), 1000);
    }

    return true;
  }

  private startReveal() {
    if (!this.state.currentRound || this.state.currentRound.captions.length === 0) {
      // No captions submitted, skip to next round
      this.startNextRound();
      return;
    }

    // Shuffle captions
    this.state.currentRound.captions = this.shuffleArray([...this.state.currentRound.captions]);

    // Skip reveal phase, go directly to judging
    this.state.phase = 'judging';
    this.state.revealIndex = this.state.currentRound.captions.length - 1;
    this.emitState();
  }

  revealNextCaption(): boolean {
    if (this.state.phase !== 'reveal' || !this.state.currentRound) {
      return false;
    }

    this.state.revealIndex++;

    if (this.state.revealIndex >= this.state.currentRound.captions.length) {
      // All captions revealed, start judging
      this.state.phase = 'judging';
    }

    this.emitState();
    return true;
  }

  startJudging() {
    this.state.phase = 'judging';
    this.emitState();
  }

  selectWinner(winnerPlayerId: string): Caption | null {
    if (this.state.phase !== 'judging' || !this.state.currentRound) {
      return null;
    }

    const winningCaption = this.state.currentRound.captions.find(
      (c) => c.playerId === winnerPlayerId
    );

    if (!winningCaption) {
      return null;
    }

    this.state.currentRound.winningCaption = winningCaption;

    // Award points
    const winner = this.state.players.find((p) => p.id === winnerPlayerId);
    if (winner) {
      winner.score += this.state.currentRound.points;
    }

    this.state.phase = 'winner';
    this.emitState();
    return winningCaption;
  }

  proceedToNextRound() {
    this.startNextRound();
  }

  endGameExplicitly() {
    this.endGame();
  }

  private endGame() {
    this.stopTimer();
    this.state.phase = 'game-over';
    // Sort players by score
    this.state.players.sort((a, b) => b.score - a.score);
    this.emitState();
  }

  resetGame() {
    this.stopTimer();
    // Keep players but reset scores
    this.state.players.forEach((p) => {
      p.score = 0;
      p.hasSubmitted = false;
    });
    this.state.phase = 'lobby';
    this.state.currentRound = null;
    this.state.roundNumber = 0;
    this.state.revealIndex = -1;
    this.emitState();
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Singleton instance
export const gameManager = new GameManager();
