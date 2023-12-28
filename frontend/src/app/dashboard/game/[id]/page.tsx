'use client'
import styles from '../page.module.css';
import React from 'react';
import Pong from '@/components/game/Pong';
import Link from 'next/link';
import Image from 'next/image';
import ProfileComp from '@/components/game/ProfileComp';

const Game = () => {
  return (
      <div className={styles.game_container}>
          <div className={styles.title}>
            <h1>Game</h1>
          </div>
          <div className="flex justify-between space-x-30">
            <ProfileComp className='ml-5'/>
            <ProfileComp className='mr-5'/>
          </div>
          <div className={styles.pong_container}>
            <Pong />
          </div>
      </div>
  );
};

export default Game;