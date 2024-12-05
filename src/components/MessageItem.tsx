import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { TMessageJSON, TParticipant } from '../types';

interface Props {
  message: TMessageJSON;
  participant: TParticipant;
  showHeader?: boolean;
  isOwnMessage?: boolean;
}

export const MessageItem = ({ message, participant, showHeader = true, isOwnMessage = false }: Props) => {
  const hasReactions = message.reactions && message.reactions.length > 0;
  const hasImage = message.attachments && message.attachments.length > 0 && message.attachments[0].type === 'image';

  return (
    <View style={[
      styles.container, 
      !showHeader && styles.groupedMessage,
      isOwnMessage && styles.ownMessageContainer
    ]}>
      {showHeader && (
        <View style={[styles.header, isOwnMessage && styles.ownMessageHeader]}>
          {participant.avatarUrl ? (
            <Image 
              source={{ uri: participant.avatarUrl }} 
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {participant.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={[styles.name, isOwnMessage && styles.ownName]}>{participant.name}</Text>
          <Text style={[styles.time, isOwnMessage && styles.ownTime]}>
            {new Date(message.sentAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      )}
      <View style={[
        styles.messageContent, 
        !showHeader && styles.groupedMessageContent,
        isOwnMessage && styles.ownMessageContent,
        hasImage && styles.messageWithImageContent
      ]}>
        {hasImage && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: message.attachments[0].url }} 
              style={[
                styles.messageImage,
                {
                  aspectRatio: message.attachments[0].width / message.attachments[0].height
                }
              ]}
              resizeMode="contain"
            />
          </View>
        )}
        <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
          {message.text}
        </Text>
        {message.updatedAt > message.sentAt && (
          <Text style={[
            styles.edited, 
            isOwnMessage && styles.ownEdited,
            !isOwnMessage && styles.otherEdited
          ]}>
            (edited)
          </Text>
        )}
      </View>
      {hasReactions && (
        <View style={[styles.reactions, isOwnMessage && styles.ownMessageReactions]}>
          {message.reactions?.map((reaction) => (
            <View key={reaction.uuid} style={styles.reaction}>
              <Text style={styles.reactionEmoji}>{reaction.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');
const MAX_IMAGE_WIDTH = width * 0.65;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginBottom: 8,
  },
  groupedMessage: {
    marginTop: -4,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  avatarPlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
    marginRight: 8,
  },
  ownName: {
    marginRight: 12,
  },
  time: {
    color: '#666',
    fontSize: 12,
  },
  ownTime: {
    marginRight: 6,
  },
  messageContent: {
    marginLeft: 40,
    maxWidth: MAX_IMAGE_WIDTH,
  },
  messageWithImageContent: {
    width: MAX_IMAGE_WIDTH,
  },
  groupedMessageContent: {
    marginLeft: 40,
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: 8,
    marginBottom: 4,
  },
  messageImage: {
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  edited: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  ownEdited: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherEdited: {
    marginLeft: 0,
  },
  reactions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginLeft: 40,
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginTop: 4,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  ownMessageHeader: {
    flexDirection: 'row-reverse',
  },
  ownMessageContent: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 8,
    marginLeft: 0,
    marginRight: 40,
  },
  ownMessageText: {
    color: '#fff',
  },
  ownMessageReactions: {
    marginLeft: 0,
    marginRight: 40,
  },
});