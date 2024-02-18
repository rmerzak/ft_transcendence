'use client';
import Bot from '@/components/game/Bot';
import User from '@/components/game/User';
import { UserEnum } from '../context/gameContext';
import { GameProvider } from '../context/gameContext';
import AuthWrapper from '@/components/auth/AuthWrapper';

const Game = () => {
    
    return (
      <AuthWrapper>
        <GameProvider>
          <div className='w-[95%] flex flex-col items-center mx-auto text-center p-[1%] shadow-md rounded-3xl bg-[#311251]/80  '>
              <div className='text-3xl font-black text-white m-4'>
                <h1>Game</h1>
              </div>

              <div className="flex flex-col md:flex-row bg-white/20 backdrop-blur- justify-between md:items-center  rounded-3xl shadow-md p-[1%] ">
                  <div className="flex-none">
                      <User id={UserEnum.PLAYER}/>
                  </div>

                  <div className="flex-grow flex items-center justify-center mb-6 mt-6">
                      <Bot />
                  </div>

                  <div className="flex-none">
                      <User id={UserEnum.BOT}/>
                  </div>
              </div>

          </div>
        </GameProvider>
      </AuthWrapper>
  );
};

export default Game;