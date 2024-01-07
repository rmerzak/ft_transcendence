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
enum Blocker {
  'SENDER',
  'RECEIVER'
}
export interface Friendship {
  id: number;
  createdAt: string;
  updateAt: string;
  status: string;
  senderId: number;
  receiverId: number;
  blocked: boolean;
  blockBy: Blocker | null;
  sender: User;
  receiver: User;
}