import styles from '../page.module.css';
import GameComp from '@/components/game/GameComp';
import React from 'react';


const Game = () => {
  return (
    <div className={styles.game_container}>
      <GameComp />
    </div>
  );
};

export default Game;