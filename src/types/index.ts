export interface TAttachment {
  type: string;
  url: string;
  width: number;
  height: number;
  uuid: string;
}

export interface TReaction {
  uuid: string;
  participantUuid: string;
  value: string;
}

export interface TMessageJSON {
  uuid: string;
  text: string;
  authorUuid: string;
  sentAt: number;
  updatedAt: number;
  reactions?: TReaction[];
  replyToMessage?: TMessageJSON;
  attachments: TAttachment[];
}

export interface TParticipant {
  uuid: string;
  name: string;
  avatarUrl: string;
  email: string;
  bio: string;
  jobTitle: string;
  createdAt: number;
  updatedAt: number;
}