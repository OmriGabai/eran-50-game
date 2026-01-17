'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, ServerToClientEvents, ClientToServerEvents } from '../types/game';

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const STORAGE_KEY = 'eran-game-player-id';

export function useSocket() {
  const [socket, setSocket] = useState<GameSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // Connect to socket server with robust reconnection settings
    const newSocket: GameSocket = io({
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [CLIENT] Connected to server | socketId=${newSocket.id}`);
      setIsConnected(true);
      setError(null);

      // Try to reconnect with stored player ID
      const storedPlayerId = localStorage.getItem(STORAGE_KEY);
      if (storedPlayerId) {
        console.log(`[${timestamp}] [CLIENT] Attempting to reconnect with stored playerId=${storedPlayerId}`);
        newSocket.emit('reconnect', storedPlayerId, (response) => {
          if (response.success) {
            setPlayerId(storedPlayerId);
            console.log(`[${new Date().toISOString()}] [CLIENT] Reconnected successfully | playerId=${storedPlayerId}`);
          } else {
            // Player ID no longer valid (server restarted), clear it
            localStorage.removeItem(STORAGE_KEY);
            setPlayerId(null);
            console.log(`[${new Date().toISOString()}] [CLIENT] Reconnect failed, session expired | playerId=${storedPlayerId}`);
          }
        });
      }
    });

    newSocket.on('disconnect', (reason) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [CLIENT] Disconnected from server | reason=${reason} | socketId=${newSocket.id}`);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        console.log(`[${timestamp}] [CLIENT] Server initiated disconnect, attempting reconnect...`);
        newSocket.connect();
      } else if (reason === 'transport close') {
        console.log(`[${timestamp}] [CLIENT] Transport closed (network issue), auto-reconnecting...`);
      } else if (reason === 'ping timeout') {
        console.log(`[${timestamp}] [CLIENT] Ping timeout (server not responding), auto-reconnecting...`);
      }
    });

    newSocket.on('connect_error', (err) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [CLIENT] Connection error | error=${err.message}`);
      setError('Connection lost. Reconnecting...');
    });

    newSocket.io.on('reconnect_attempt', (attempt) => {
      console.log(`[${new Date().toISOString()}] [CLIENT] Reconnection attempt #${attempt}`);
    });

    newSocket.io.on('reconnect', (attempt) => {
      console.log(`[${new Date().toISOString()}] [CLIENT] Reconnected after ${attempt} attempts`);
    });

    newSocket.io.on('reconnect_failed', () => {
      console.log(`[${new Date().toISOString()}] [CLIENT] Reconnection failed after all attempts`);
      setError('Could not reconnect. Please refresh the page.');
    });

    newSocket.on('game-state', (state) => {
      setGameState(state);
    });

    newSocket.on('timer-tick', (time) => {
      setTimeRemaining(time);
    });

    newSocket.on('error', (message) => {
      setError(message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinGame = useCallback((name: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      if (!socket) {
        resolve({ success: false, error: 'Not connected' });
        return;
      }

      socket.emit('join', name, (response) => {
        if (response.success && response.playerId) {
          setPlayerId(response.playerId);
          localStorage.setItem(STORAGE_KEY, response.playerId);
        }
        resolve(response);
      });
    });
  }, [socket]);

  const submitCaption = useCallback((text: string) => {
    socket?.emit('submit-caption', text);
  }, [socket]);

  const selectWinner = useCallback((winnerId: string) => {
    socket?.emit('select-winner', winnerId);
  }, [socket]);

  const startGame = useCallback(() => {
    socket?.emit('start-game');
  }, [socket]);

  const nextReveal = useCallback(() => {
    socket?.emit('next-reveal');
  }, [socket]);

  const startJudging = useCallback(() => {
    socket?.emit('start-judging');
  }, [socket]);

  const nextRound = useCallback(() => {
    socket?.emit('next-round');
  }, [socket]);

  const endGame = useCallback(() => {
    socket?.emit('end-game');
  }, [socket]);

  const resetGame = useCallback(() => {
    socket?.emit('reset-game');
  }, [socket]);

  const currentPlayer = gameState?.players.find((p) => p.id === playerId) ?? null;

  return {
    isConnected,
    gameState,
    playerId,
    currentPlayer,
    error,
    timeRemaining,
    joinGame,
    submitCaption,
    selectWinner,
    startGame,
    nextReveal,
    startJudging,
    nextRound,
    endGame,
    resetGame,
  };
}
