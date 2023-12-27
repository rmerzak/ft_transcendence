'use client'
import styles from '../page.module.css';
import GameCanvas from '@/components/game/Pong';
import React from 'react';
import { usePathname } from 'next/navigation'

import { userContext } from '@/components/game/GameFirstPage';
import Pong from '@/components/game/Pong';

const Game = () => {
  return (
      <div className={styles.game_container}>
          <div className={styles.title}>
            <h1>Game</h1>
          </div>
        <Pong  />
      </div>
  );
};

export default Game;