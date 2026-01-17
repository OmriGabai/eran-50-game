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
    const clientIp = socket.handshake.address;
    const transport = socket.conn.transport.name;
    console.log(`[CONNECT] Client connected | socketId=${socket.id} | ip=${clientIp} | transport=${transport}`);

    // Send current state to new connection
    socket.emit('game-state', gameManager.getState());

    // Player joins the game
    socket.on('join', (name, callback) => {
      console.log(`[JOIN] Player attempting to join | socketId=${socket.id} | name=${name}`);
      const result = gameManager.addPlayer(name);
      if (result.success && result.playerId) {
        socketToPlayer.set(socket.id, result.playerId);
        const player = gameManager.getPlayer(result.playerId);
        console.log(`[JOIN] Player joined successfully | socketId=${socket.id} | playerId=${result.playerId} | name=${name} | isJudge=${player?.isJudge}`);
        if (player) {
          io?.emit('player-joined', player);
        }
      } else {
        console.log(`[JOIN] Player join failed | socketId=${socket.id} | name=${name} | error=${result.error}`);
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
    socket.on('start-game', async () => {
      // Sync images from Cloudinary if needed, then load into game
      const images = await imageStore.syncFromCloudinary();
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

    // Host ends game explicitly
    socket.on('end-game', () => {
      gameManager.endGameExplicitly();
    });

    // Host resets game
    socket.on('reset-game', () => {
      gameManager.resetGame();
    });

    // Player reconnects
    socket.on('reconnect', (playerId, callback) => {
      console.log(`[RECONNECT] Player attempting to reconnect | socketId=${socket.id} | playerId=${playerId}`);
      const result = gameManager.reconnectPlayer(playerId);
      if (result.success) {
        socketToPlayer.set(socket.id, playerId);
        const player = gameManager.getPlayer(playerId);
        console.log(`[RECONNECT] Player reconnected successfully | socketId=${socket.id} | playerId=${playerId} | name=${player?.name}`);
      } else {
        console.log(`[RECONNECT] Player reconnect failed | socketId=${socket.id} | playerId=${playerId} | error=${result.error}`);
      }
      callback(result);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      const playerId = socketToPlayer.get(socket.id);
      const player = playerId ? gameManager.getPlayer(playerId) : null;
      console.log(`[DISCONNECT] Client disconnected | socketId=${socket.id} | reason=${reason} | playerId=${playerId || 'none'} | playerName=${player?.name || 'unknown'}`);

      if (playerId) {
        gameManager.removePlayer(playerId);
        socketToPlayer.delete(socket.id);
        io?.emit('player-left', playerId);
        console.log(`[DISCONNECT] Player marked as disconnected | playerId=${playerId} | name=${player?.name}`);
      }
    });

    // Log transport upgrades (polling -> websocket)
    socket.conn.on('upgrade', (transport) => {
      const playerId = socketToPlayer.get(socket.id);
      console.log(`[TRANSPORT] Connection upgraded | socketId=${socket.id} | playerId=${playerId || 'none'} | newTransport=${transport.name}`);
    });
  });

  return io;
}

export function getIO() {
  return io;
}
