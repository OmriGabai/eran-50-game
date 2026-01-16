import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { gameManager } from './gameManager';
import { imageStore } from './imageStore';
import { ServerToClientEvents, ClientToServerEvents } from '../types/game';

let io: SocketIOServer<ClientToServerEvents, ServerToClientEvents> | null = null;

// Map socket IDs to player IDs
const socketToPlayer = new Map<string, string>();

export function initializeSocket(httpServer: HTTPServer) {
  if (io) {
    return io;
  }

  io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Set up game state change listener
  gameManager.setOnStateChange((state) => {
    io?.emit('game-state', state);
  });

  // Set up timer tick listener
  gameManager.setOnTimerTick((time) => {
    io?.emit('timer-tick', time);
  });

  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log('Client connected:', socket.id);

    // Send current state to new connection
    socket.emit('game-state', gameManager.getState());

    // Player joins the game
    socket.on('join', (name, callback) => {
      const result = gameManager.addPlayer(name);
      if (result.success && result.playerId) {
        socketToPlayer.set(socket.id, result.playerId);
        const player = gameManager.getPlayer(result.playerId);
        if (player) {
          io?.emit('player-joined', player);
        }
      }
      callback(result);
    });

    // Player submits a caption
    socket.on('submit-caption', (text) => {
      const playerId = socketToPlayer.get(socket.id);
      if (playerId) {
        const success = gameManager.submitCaption(playerId, text);
        if (success) {
          io?.emit('caption-submitted', playerId);
        }
      }
    });

    // Judge selects winner (host controls this)
    socket.on('select-winner', (winnerId) => {
      const caption = gameManager.selectWinner(winnerId);
      if (caption) {
        io?.emit('winner-selected', caption);
      }
    });

    // Host starts the game
    socket.on('start-game', () => {
      // Load images from the image store
      const images = imageStore.getImages();
      gameManager.setImages(images);
      gameManager.startGame();
    });

    // Host reveals next caption
    socket.on('next-reveal', () => {
      gameManager.revealNextCaption();
    });

    // Host starts judging phase
    socket.on('start-judging', () => {
      gameManager.startJudging();
    });

    // Host moves to next round
    socket.on('next-round', () => {
      gameManager.proceedToNextRound();
    });

    // Host resets game
    socket.on('reset-game', () => {
      gameManager.resetGame();
    });

    // Player reconnects
    socket.on('reconnect', (playerId, callback) => {
      const result = gameManager.reconnectPlayer(playerId);
      if (result.success) {
        socketToPlayer.set(socket.id, playerId);
      }
      callback(result);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      const playerId = socketToPlayer.get(socket.id);
      if (playerId) {
        gameManager.removePlayer(playerId);
        socketToPlayer.delete(socket.id);
        io?.emit('player-left', playerId);
      }
    });
  });

  return io;
}

export function getIO() {
  return io;
}
