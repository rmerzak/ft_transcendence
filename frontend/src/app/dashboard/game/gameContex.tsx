import { useContext, createContext, useState } from "react";

export enum UserEnum {
  USER = 1,
  OPPONENT = 2,
  PLAYER = 3,
  BOT = 4,
}

interface GameContextProps {
    uid: number;
    oid: number;
    userName: string;
    opponentName: string;
    userImage: string;
    opponentImage: string;
    player1Score: number;
    player2Score: number;
    player1Elo: number;
    player2Elo: number;
    updateScores: (newPlayer1Score: number, newPlayer2Score: number) => void;
    setPlayer1Elo: (newPlayer1Elo: number) => void;
    setPlayer2Elo: (newPlayer2Elo: number) => void;
    setUserInfo: (uid: number, userName: string, userImage: string) => void;
    setOpponentInfo: (oid:number, opponentName: string, opponentImage: string) => void;
  }

const GameContext = createContext<GameContextProps>({
    uid: 0,
    oid: 0,
    userName: 'Loading...',
    userImage: '/game/avatar.jpeg',
    opponentName: 'Loading...',
    opponentImage: '/game/avatar.jpeg',
    player1Score: 0,
    player2Score: 0,
    player1Elo: 800,
    player2Elo: 800,
    updateScores: () => {},
    setPlayer1Elo: () => {},
    setPlayer2Elo: () => {},
    setUserInfo: () => {},
    setOpponentInfo: () => {},
  });

export const GameProvider = ({ children } : any) => {
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [player1Elo, setPlayer1Elo] = useState(800);
    const [player2Elo, setPlayer2Elo] = useState(800);

    const [uid, setId] = useState(0);
    const [oid, setOid] = useState(0);
    const [userName, setUserName] = useState('Loading...');
    const [opponentName, setOpponentName] = useState('Loading...');
    const [userImage, setUserImage] = useState('/avatar.jpeg');
    const [opponentImage, setOpponentImage] = useState('/avatar.jpeg');

  
    const updateScores = (newPlayer1Score: number, newPlayer2Score: number) => {
      setPlayer1Score(newPlayer1Score);
      setPlayer2Score(newPlayer2Score);
    };

    const setUserInfo = (pid: number, userName: string, userImage: string) => {
        setId(pid);
        setUserName(userName);
        setUserImage(userImage);
    };

    const setOpponentInfo = (oid: number, opponentName: string, opponentImage: string) => {
        setOid(oid);
        setOpponentName(opponentName);
        setOpponentImage(opponentImage);
    };
  
    return (
      <GameContext.Provider value={
        { 
          player1Score,
          player2Score,
          updateScores,
          player1Elo,
          player2Elo,
          setPlayer1Elo,
          setPlayer2Elo,
          uid,
          userName,
          userImage,
          setUserInfo,
          oid,
          opponentName,
          opponentImage,
          setOpponentInfo,
        }}>
        {children}
      </GameContext.Provider>
    );
  };
  
  export const useGame = () => useContext(GameContext);

