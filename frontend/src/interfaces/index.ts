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