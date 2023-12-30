import styles from '../page.module.css';
import Online from '@/components/game/Online';
import React from 'react';


const Game = () => {
  return (
    <div className={styles.game_container}>
      <Online />
    </div>
  );
};

export default Game;
