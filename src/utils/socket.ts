import AsyncStorage from '@react-native-async-storage/async-storage';

import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';
import type { DependencyList } from 'react'; // Changed to React Native type

let socket: Socket | null = null;
let listeners: Record<string, Set<Function>> = {};

export const initializeSocket = async (): Promise<Socket> => {
  if (socket) return socket; // Nếu đã có socket thì trả về luôn

  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('🚨 Không tìm thấy Access Token, không thể kết nối socket');
      throw new Error('Không có Access Token');
    }


    socket = io('https://ctynamviet.1erp.vn', {
      extraHeaders: {
        Authorization: `${accessToken}`,
      },
      reconnection: true, // Cho phép tự động reconnect
      reconnectionAttempts: 5, // Thử lại tối đa 5 lần
      reconnectionDelay: 3000, // Mỗi lần thử lại cách nhau 3 giây
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('❗ Socket connection error:', error);
    });
  } catch (error) {
    console.error('⚠️ Error initializing socket:', error);
  }

  return socket!;
};

export const getSocket = async (): Promise<Socket> => {
  if (socket) {
    return socket;
  }
  console.warn('⚠️ Socket not initialized. Waiting for initialization...');
  return await initializeSocket();
};

export const registerSocketListener = async (event: string, callback: Function): Promise<void> => {
  if (!listeners[event]) {
    listeners[event] = new Set();
  }
  listeners[event].add(callback);

  const socket = await getSocket();
  socket.on(event, callback as (...args: any[]) => void);
};

export const unregisterSocketListener = (event: string, callback: Function): void => {
  if (listeners[event]) {
    listeners[event].delete(callback);
    if (socket) {
      socket.off(event, callback as (...args: any[]) => void);
    }
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // Clear the socket reference
    console.log('Socket disconnected');
  }
};

export function useSocketEvent(
  eventName: string,
  callback: (...args: any[]) => void,
  dependencies: DependencyList = []
) {
  useEffect(() => {
    let socketInstance: Socket;
    
    const setupSocket = async () => {
      socketInstance = await getSocket();
      socketInstance.on(eventName, callback);
    };

    setupSocket();

    return () => {
      if (socketInstance) {
        socketInstance.off(eventName, callback);
      }
    };
  }, dependencies);
}

export function useMultiSocketEvents(
  events: { event: string; callback: (...args: any[]) => void }[],
  dependencies: DependencyList = []
) {
  useEffect(() => {
    let socketInstance: Socket;

    const setupSocket = async () => {
      socketInstance = await getSocket();
      events.forEach(({ event, callback }) => {
        socketInstance.on(event, callback);
      });
    };

    setupSocket();

    return () => {
      if (socketInstance) {
        events.forEach(({ event, callback }) => {
          socketInstance.off(event, callback);
        });
      }
    };
  }, [...dependencies, socket]);
}