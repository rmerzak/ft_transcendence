'use client'
import styles from './page.module.css';
import Play from '@/components/game/Play';


const Game = () => {
  return (
    <>
        <div className='w-[95%] mx-auto text-center p-[1%] shadow-md rounded-3xl bg-[#311251]/80' >
          <h1 className='text-3xl font-black text-white m-4'>
            Game
          </h1>
          <Play />
        </div>
    </>
  );
};

export default Game;
