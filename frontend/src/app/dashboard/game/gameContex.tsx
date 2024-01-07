import { useContext, createContext, useState } from "react";

interface GameContextProps {
    uid: number;
    oid: number;
    userName: string;
    opponentName: string;
    userImage: string;
    opponentImage: string;
    player1Score: number;
    player2Score: number;
    updateScores: (newPlayer1Score: number, newPlayer2Score: number) => void;
    setUserInfo: (uid: number, userName: string, userImage: string) => void;
    setOpponentInfo: (oid:number, opponentName: string, opponentImage: string) => void;
  }

const GameContext = createContext<GameContextProps>({
    uid: 0,
    oid: 0,
    userName: 'Loading...',
    userImage: '/avatar.jpeg',
    opponentName: 'Loading...',
    opponentImage: '/avatar.jpeg',
    player1Score: 0,
    player2Score: 0,
    updateScores: () => {},
    setUserInfo: () => {},
    setOpponentInfo: () => {},
  });

export const GameProvider = ({ children } : any) => {
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);

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

