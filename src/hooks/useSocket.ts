'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
  const reconnectAttemptedRef = useRef(false);

  useEffect(() => {
    // Connect to socket server
    const newSocket: GameSocket = io({
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);

      // Try to reconnect with stored player ID
      const storedPlayerId = localStorage.getItem(STORAGE_KEY);
      if (storedPlayerId && !reconnectAttemptedRef.current) {
        reconnectAttemptedRef.current = true;
        newSocket.emit('reconnect', storedPlayerId, (response) => {
          if (response.success) {
            setPlayerId(storedPlayerId);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
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
    resetGame,
  };
}
