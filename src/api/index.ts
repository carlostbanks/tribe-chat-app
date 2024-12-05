import axios from 'axios';
import { TMessageJSON, TParticipant } from '../types';

const BASE_URL = 'http://dummy-chat-server.tribechat.pro/api';

const api = {
  async getServerInfo() {
    try {
      const response = await axios.get(`${BASE_URL}/info`);
      return response.data;
    } catch (error) {
      console.error('Server info error:', error);
      throw error;
    }
  },

  async getAllMessages(): Promise<TMessageJSON[]> {
    try {
      const response = await axios.get<TMessageJSON[]>(`${BASE_URL}/messages/all`);
      // Sort messages by time in descending order (newest first)
      return response.data.sort((a, b) => b.sentAt - a.sentAt);
    } catch (error) {
      console.error('Get all messages error:', error);
      throw error;
    }
  },

  async getAllParticipants(): Promise<TParticipant[]> {
    try {
      const response = await axios.get<TParticipant[]>(`${BASE_URL}/participants/all`);
      return response.data;
    } catch (error) {
      console.error('Get all participants error:', error);
      throw error;
    }
  },

  async sendMessage(text: string) {
    try {
      const response = await axios.post<TMessageJSON>(`${BASE_URL}/messages/new`, { text });
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },

  async getMessageUpdates(since: number): Promise<TMessageJSON[]> {
    try {
      const response = await axios.get<TMessageJSON[]>(`${BASE_URL}/messages/updates/${since}`);
      return response.data;
    } catch (error) {
      console.error('Get message updates error:', error);
      throw error;
    }
  },

  async getParticipantUpdates(since: number): Promise<TParticipant[]> {
    try {
      const response = await axios.get<TParticipant[]>(`${BASE_URL}/participants/updates/${since}`);
      return response.data;
    } catch (error) {
      console.error('Get participant updates error:', error);
      throw error;
    }
  }
};

export { api };