import styles from './page.module.css';
import OnlineOrBot from '@/components/game/OnlineOrBot';
import GameFirstPage from '@/components/game/GameFirstPage';
import React from 'react';


const Game = () => {
  return (
    <div className={styles.game_container} >
      <h1 className={styles.title}>
        Game
      </h1>
      <GameFirstPage />
    </div>
  );
};

export default Game;
