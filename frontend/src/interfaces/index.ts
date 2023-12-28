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
  }

export  interface Notification {
    id: number;
    createdAt: string;
    type: string;
    content: string;
    RequestId: number;
    RequestType: string;
    vue: boolean;
    userId: number;
    senderId: number;
  }