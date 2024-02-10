export interface MatchHistoryItemInterface {
  PlayerOne: string;
  PlayerTwo: string;
  ImgPlayerOne: string;
  ImgPlayerTwo: string;
  ScorePlayerOne: string;
  ScorePlayerTwo: string;
}
export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  image: string;
  isVerified: boolean;
  twoFactorSecret: string | null;
  twoFactorEnabled: boolean;
  status: string;
}

export interface Notification {
  id: number;
  createdAt: string;
  type: string;
  content: string;
  RequestId: number;
  RequestType: string;
  vue: boolean;
  userId: number;
  senderId: number;
  senderName: string;
  senderImage: string;
}
export enum Blocker {
  SENDER = 'SENDER',
  RECEIVER = 'RECEIVER'
}
export interface Friendship {
  id: number;
  createdAt: string;
  updateAt: string;
  status: string;
  senderId: number;
  receiverId: number;
  block: boolean;
  blockBy: Blocker | null;
  sender: User;
  receiver: User;
}

export enum RoomVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED'
}

export interface ChatRoom {
  id?: number;
  name?: string;
  visibility?: RoomVisibility;
  createdAt?: string;
  updatedAt?: string;
  passwordHash?: string;
  owner?: number;
}

export interface ChatRoomMember {
  userId: number;
  chatRoomId: number;
  joinedAt: string;
  is_admin: boolean;
  leftAt: string;
  user: User;
  status: string;
  chatRoom: ChatRoom;
  mutedDuration: String;
}

export interface Messages {
  type: any;
  id?: number;
  text: string;
  createdAt?: string;
  senderId: number;
  chatRoomId: number;
  sender?: User;
}

// helper interface
export interface ChatRoomUsers {
  user: {
    id: number;
    username: string;
    image: string;
    status: string;
  };
}

export interface Recent {
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  senderId?: number;
  chatRoomId: number;
  link: String;
  show?: boolean;
  lastMessage: string;
  chatRoom?: {
    id?: number;
    name: string;
    users: {
      id: number;
      username: string;
      image: string;
    }[];
  }
};

export interface ChatRoomInvitedMembers {
  chatRoomId: number;
  senderId: number;
  status: string;
  sender: User;
  createdAt: string;
}