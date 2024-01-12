'use client';
import React, { useEffect } from 'react';
import Pong from '@/components/game/Pong';
import User from '@/components/game/User';
import { GameProvider } from '../gameContex';
import { UserEnum } from '../gameContex';
import { useAtomValue } from 'jotai';
import { themeAtom } from '@/components/game/theme';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';


const Game = () => {

    const theme = useAtomValue(themeAtom);
    const router = useRouter();
    
    useEffect(() => {
        if (theme == -1) {
            Swal.fire({
                title: 'You have no access to this page',
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    popup: 'bg-gradient-to-r from-[#510546]/40 to-[#6958be]/40'
                }
            }).then(() => {
                router.push('/dashboard/game', { scroll: false });
            });
        }
        return () => {
            // cleanup
        }
    }, [router, theme]);

    return (
      <GameProvider>
        {
          theme !== -1 &&
          <div className='w-[95%] mx-auto text-center p-[1%] shadow-md rounded-3xl bg-[#311251]/80'>

                <div className='text-3xl font-black text-white m-4'>
                  <h1>Game</h1>
                </div>

                <div className="flex justify-around items-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900/70 to-gray-600/70 rounded-3xl shadow-md p-[1%]">
                    <div className="flex-none">
                        <User id={UserEnum.USER}/>
                    </div>

                    <div className="flex-grow flex items-center justify-center">
                        <Pong />
                    </div>

                    <div className="flex-none">
                        <User id={UserEnum.OPPONENT}/>
                    </div>
                </div>
          </div>
        }
      </GameProvider>
  );
};

export default Game;