import styles from './page.module.css';
import OnlineOrBot from '@/components/game/OnlineOrBot';
import dynamic from 'next/dynamic';
// const OnlineOrBot = dynamic(() => import('@/components/game/OnlineOrBot'), { ssr: false })
import React from 'react';


const Game = () => {
  return (
    <div className={styles.game_container}>
      <OnlineOrBot />
    </div>
  );
};

export default Game;
