import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ChatService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      const base = API_BASE_URL.replace('/api','');
      this.socket = io(base, { transports: ['websocket'] });
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  join(room: string) {
    this.socket?.emit('join', room);
  }

  onMessage(handler: (msg: any) => void) {
    this.socket?.on('message', handler);
  }

  offMessage(handler: (msg: any) => void) {
    this.socket?.off('message', handler);
  }

  async send(room: string, text: string) {
    const userData = await AsyncStorage.getItem('user_data');
    const user = userData ? JSON.parse(userData) : null;
    this.socket?.emit('message', { room, userId: user?.id, text });
  }
}

export const chatService = new ChatService();

