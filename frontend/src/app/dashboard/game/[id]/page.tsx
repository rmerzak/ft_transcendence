'use client'
import styles from '../page.module.css';
import React, { useState } from 'react';
import Pong from '@/components/game/Pong';
import Link from 'next/link';
import Image from 'next/image';
import User from '@/components/game/User';
import { Socket, io } from 'socket.io-client';

// use props to pass socket
// do that copilot

const Game = () => {
  return (
      <div className='w-[95%] mx-auto text-center p-[1%] shadow-md rounded-3xl bg-[#311251]/80'>
          <div className='text-3xl font-black text-white m-4'>
            <h1>Game</h1>
          </div>

          <div className="flex justify-around items-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900/70 to-gray-600/70 bg-gradient-to-r rounded-3xl shadow-md p-[1%]">
              <div className="flex-none">
                  <User />
              </div>

              <div className="flex-grow flex items-center justify-center">
                  <Pong />
              </div>

              <div className="flex-none">
                  <User />
              </div>
          </div>

      </div>
  );
};

export default Game;