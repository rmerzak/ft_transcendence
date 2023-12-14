'use client'
import styles from '../page.module.css';
import GameCanvas from '@/components/game/GameCanvas';
import React from 'react';
import { usePathname } from 'next/navigation'


const Game = () => {
	const pathname = usePathname();
	const id = pathname.split('/')[3];
  return (
    <div className={styles.game_container}>
       <div className={styles.title}>
	        <h1>GameId</h1>
	      </div>
		  
      <GameCanvas  imgIndex={Number(id)}/>
    </div>
  );
};

export default Game;