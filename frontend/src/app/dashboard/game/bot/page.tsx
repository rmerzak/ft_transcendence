'use client';
import React, { useContext, useState } from 'react';
import Bot from '@/components/game/Bot';
import User from '@/components/game/User';
import { GameProvider } from '../gameContex';
import { UserEnum } from '../gameContex';

const Game = ({ searchParams } : {
    searchParams: {
        theme: string;
    };
  }) => {

    return (
      <GameProvider>
        <div className='w-[95%] mx-auto text-center p-[1%] shadow-md rounded-3xl bg-[#311251]/80'>
            <div className='text-3xl font-black text-white m-4'>
              <h1>Game</h1>
            </div>

            <div className="flex justify-around items-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900/70 to-gray-600/70 rounded-3xl shadow-md p-[1%]">
                <div className="flex-none">
                    <User id={UserEnum.PLAYER}/>
                </div>

                <div className="flex-grow flex items-center justify-center">
                    <Bot 
                      theme={searchParams.theme}
                      />
                </div>

                <div className="flex-none">
                    <User id={UserEnum.BOT}/>
                </div>
            </div>

        </div>
      </GameProvider>
  );
};

export default Game;