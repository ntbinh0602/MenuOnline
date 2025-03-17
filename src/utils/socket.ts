import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

let socket: Socket | null = null;

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

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
