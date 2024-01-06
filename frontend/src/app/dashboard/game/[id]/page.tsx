import React, { useState } from 'react';
import Pong from '@/components/game/Pong';
import User from '@/components/game/User';


const Game = ({ searchParams } : {
    searchParams: {
        theme: string;
    };
  }) => {
    console.log(searchParams.theme);
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
                  <Pong theme={searchParams.theme}/>
              </div>

              <div className="flex-none">
                  <User />
              </div>
          </div>

      </div>
  );
};

export default Game;