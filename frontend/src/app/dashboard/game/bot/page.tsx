'use client';
import Bot from '@/components/game/Bot';
import User from '@/components/game/User';
import { UserEnum } from '../context/gameContext';
import { GameProvider } from '../context/gameContext';

const Game = () => {
    
    return (
      <>
        {/* <div className='w-[88%] absolute top-[50%] -translate-y-[50%] flex flex-col mx-auto text-center p-[1%] shadow-md rounded-3xl bg-[#311251]/80 duration-300 ease-in-out rotate-[90deg] md:rotate-0'> */}
        <div className='w-[88%] absolute top-[50%] -translate-y-[50%] flex flex-col items-center mx-auto text-center p-[1%] shadow-md rounded-3xl bg-[#311251]/80 duration-300 ease-in-out max-md:h-[88%] max-md:mt-6'>
            {/* <div className='text-3xl font-black text-white m-4 bg-red-500'>
              <h1>Game</h1>
            </div> */}
            <div className='text-3xl font-black text-white m-4'>
              <h1>Game</h1>
            </div>

            <div className="flex justify-around items-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900/70 to-gray-600/70 rounded-3xl shadow-md p-[1%] -rotate-[90deg] md:rotate-0 duration-300 ease-in-out max-md:w-[750px] max-md:mt-[250px]">
                <div className="flex-none">
                    <User id={UserEnum.PLAYER}/>
                </div>

                <div className="flex-grow flex items-center justify-center">
                    <Bot />
                </div>

                <div className="flex-none">
                    <User id={UserEnum.BOT}/>
                </div>
            </div>

        </div>
      </>
  );
};

export default Game;