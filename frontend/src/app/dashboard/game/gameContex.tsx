import { useContext, createContext, useState } from "react";

interface GameContextProps {
    player1Score: number;
    player2Score: number;
    updateScores: (newPlayer1Score: number, newPlayer2Score: number) => void;
  }

const GameContext = createContext<GameContextProps>({
    player1Score: 0,
    player2Score: 0,
    updateScores: () => {},
  });

export const GameProvider = ({ children } : any) => {
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
  
    const updateScores = (newPlayer1Score: number, newPlayer2Score: number) => {
      setPlayer1Score(newPlayer1Score);
      setPlayer2Score(newPlayer2Score);
    };
  
    return (
      <GameContext.Provider value={{ player1Score, player2Score, updateScores }}>
        {children}
      </GameContext.Provider>
    );
  };
  
  export const useGame = () => useContext(GameContext);

