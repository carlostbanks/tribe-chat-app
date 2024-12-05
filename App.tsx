import React, { useEffect, useState, useCallback } from 'react';
import { 
  SafeAreaView, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  View, 
  StyleSheet,
  Text,
  ListRenderItem,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MessageItem } from './src/components/MessageItem';
import useChatStore from './src/store/chatStore';
import { api } from './src/api';
import { TMessageJSON } from './src/types';

const UPDATE_INTERVAL = 3000; // Poll for updates every 3 seconds

export default function App() {
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const { 
    messages, 
    participants, 
    setMessages, 
    setParticipants, 
    setSessionUuid,
    addMessage,
    updateMessages,
    updateParticipants,
    sessionUuid: currentSessionUuid,
  } = useChatStore();

  const checkForUpdates = useCallback(async () => {
    try {
      // Check session UUID
      const { sessionUuid } = await api.getServerInfo();
      if (sessionUuid !== currentSessionUuid) {
        console.log('Session changed, reloading all data...', {
          old: currentSessionUuid,
          new: sessionUuid
        });
        const [allMessages, allParticipants] = await Promise.all([
          api.getAllMessages(),
          api.getAllParticipants(),
        ]);
        setSessionUuid(sessionUuid);
        setMessages(allMessages);
        setParticipants(allParticipants);
        setLastUpdateTime(Date.now());
        console.log('Data reloaded after session change');
        return;
      }

      // Get updates since last check
      const [messageUpdates, participantUpdates] = await Promise.all([
        api.getMessageUpdates(lastUpdateTime),
        api.getParticipantUpdates(lastUpdateTime),
      ]);

      if (messageUpdates.length > 0) {
        console.log(`Received ${messageUpdates.length} message updates`);
        updateMessages(messageUpdates);
      }
      
      if (participantUpdates.length > 0) {
        console.log(`Received ${participantUpdates.length} participant updates`);
        updateParticipants(participantUpdates);
      }

      setLastUpdateTime(Date.now());
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }, [lastUpdateTime, currentSessionUuid]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        console.log('Initializing chat...');
        
        const [{ sessionUuid }, allMessages, allParticipants] = await Promise.all([
          api.getServerInfo(),
          api.getAllMessages(),
          api.getAllParticipants(),
        ]);

        console.log(`Loaded ${allMessages.length} messages`);
        console.log(`Loaded ${allParticipants.length} participants`);
        console.log('Session UUID:', sessionUuid);

        setSessionUuid(sessionUuid);
        setMessages(allMessages);
        setParticipants(allParticipants);
        setLastUpdateTime(Date.now());
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(checkForUpdates, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [loading, checkForUpdates]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      // Send message to server
      const sentMessage = await api.sendMessage(messageText);
      addMessage(sentMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      setNewMessage(messageText);
    }
  };

  const renderMessage: ListRenderItem<TMessageJSON> = ({ item, index }) => {
    const participant = participants.find((p) => p.uuid === item.authorUuid);
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
    const showHeader = !nextMessage || nextMessage.authorUuid !== item.authorUuid;
    const isOwnMessage = item.authorUuid === 'you';

    if (!participant) {
      return null;
    }

    return (
      <MessageItem 
        message={item} 
        participant={participant} 
        showHeader={showHeader}
        isOwnMessage={isOwnMessage}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({
          ios: 0,
          android: 0,
        })}
      >
        <FlatList<TMessageJSON>
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.uuid}
          inverted
          contentContainerStyle={styles.messageList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#fff',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});