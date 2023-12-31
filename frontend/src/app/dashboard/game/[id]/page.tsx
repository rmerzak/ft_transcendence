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
        <div className="flex flex-col items-center rounded-lg bg-gradient-to-r from-[#510546]/40 to-[#6958be]/40 p-4 ml-20 mr-20 backdrop-blur">
          {/* <div className="flex justify-between w-full max-w-screen-xl">
            <ProfileComp className="ml-5" />
            <ProfileComp className="mr-5" />
          </div> */}
          <div className={styles.pong_container}>
            <Pong />
          </div>
        </div>
      </div>
  );
};

export default Game;