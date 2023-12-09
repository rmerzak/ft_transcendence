import styles from './page.module.css';
import OnlineOrBot from '@/components/game/OnlineOrBot';
import React from 'react';


const Game = () => {
  return (
    <div className={styles.game_container}>
      <OnlineOrBot />
    </div>
  );
};

export default Game;
