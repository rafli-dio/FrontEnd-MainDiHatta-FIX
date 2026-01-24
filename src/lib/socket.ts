'use client';

import { io, Socket } from 'socket.io-client';

/**
 * Get the WebSocket URL for Socket.IO connection
 * Falls back to BACKEND_URL if WS_URL is not set
 */
const getSocketUrl = (): string => {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL?.trim();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  
  // Prefer explicit WS_URL, fall back to backend URL
  if (wsUrl) return wsUrl;
  if (backendUrl) return backendUrl;
  
  // Last resort default (localhost)
  return 'http://localhost:8000';
};

const socketUrl = getSocketUrl();

const socket: Socket = io(socketUrl, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
  auth: {
    token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
  },
});

// Log connection status in development
if (process.env.NODE_ENV === 'development') {
  socket.on('connect', () => {
    console.log('[Socket.IO] Connected:', socketUrl);
  });
  socket.on('disconnect', (reason) => {
    console.log('[Socket.IO] Disconnected:', reason);
  });
  socket.on('connect_error', (error) => {
    console.error('[Socket.IO] Connection error:', error);
  });
}

export default socket;
