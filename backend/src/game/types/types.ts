export type Statistics = {
    gameMatches: number;
    gameWins: number;
    gameLoses: number;
    gameElo: number;
    gameRank: number;
  };
  
export type MatchHistory = {
    userPlayerId: number;
    userOpponentId: number;
    userScore: number;
    oppScore: number;
    user: {
      username: string;
      image: string;
    };
    opponent: {
      username: string;
      image: string;
    };
  };
  
export type Leaderboard = {
    id: number;
    gameRank: number;
    username: string;
    image: string;
    gameElo: number;
    gameMatches: number;
    gameWins: number;
  };