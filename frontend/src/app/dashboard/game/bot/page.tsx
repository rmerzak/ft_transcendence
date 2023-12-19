import styles from '../page.module.css';
import GameCanvas from '@/components/game/GameCanvas';
import React from 'react';


const Game = () => {
  return (
    <div className={styles.game_container}>
       <div className={styles.title}>
	        <h1>Game</h1>
	      </div>
      {/* <GameCanvas /> */}
    </div>
  );
};

export default Game;