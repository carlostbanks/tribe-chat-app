import  create  from 'zustand';
import { TMessageJSON, TParticipant } from '../types';

interface ChatState {
  messages: TMessageJSON[];
  participants: TParticipant[];
  sessionUuid: string | null;
  setMessages: (messages: TMessageJSON[]) => void;
  setParticipants: (participants: TParticipant[]) => void;
  setSessionUuid: (uuid: string) => void;
  addMessage: (message: TMessageJSON) => void;
  updateMessages: (updates: TMessageJSON[]) => void;
  updateParticipants: (updates: TParticipant[]) => void;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  participants: [],
  sessionUuid: null,
  setMessages: (messages) => set({ messages: messages.sort((a, b) => b.sentAt - a.sentAt) }),
  setParticipants: (participants) => set({ participants }),
  setSessionUuid: (sessionUuid) => set({ sessionUuid }),
  addMessage: (message) => 
    set((state) => {
      // Check if message already exists
      const exists = state.messages.some(m => m.uuid === message.uuid);
      if (exists) {
        return state; // Return unchanged state if message exists
      }
      // Add new message at the beginning of the array
      return { 
        messages: [message, ...state.messages]
      };
    }),
  updateMessages: (updates) =>
    set((state) => {
      const messages = [...state.messages];
      updates.forEach(update => {
        const index = messages.findIndex(m => m.uuid === update.uuid);
        if (index >= 0) {
          messages[index] = update;
        } else {
          messages.unshift(update);
        }
      });
      return { messages: messages.sort((a, b) => b.sentAt - a.sentAt) };
    }),
  updateParticipants: (updates) =>
    set((state) => {
      const participants = [...state.participants];
      updates.forEach(update => {
        const index = participants.findIndex(p => p.uuid === update.uuid);
        if (index >= 0) {
          participants[index] = update;
        } else {
          participants.push(update);
        }
      });
      return { participants };
    }),
}));

export default useChatStore;