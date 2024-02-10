'use client';
import React, { useEffect } from 'react';
import Pong from '@/components/game/Pong';
import User from '@/components/game/User';
import { GameProvider, UserEnum } from '../context/gameContext';
import { useAtomValue } from 'jotai';
import { themeAtom } from '@/components/game/atoms';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { modeAtom } from '@/components/game/atoms';
import { usePathname } from 'next/navigation';
import AuthWrapper from '@/components/auth/AuthWrapper';


const Game = () => {

    const theme = useAtomValue(themeAtom);
    const router = useRouter();
    const pathname = usePathname();
    const roomId = pathname.split("/").pop()?.toString();
    const mode = useAtomValue(modeAtom);
    const [check, setCheck] = React.useState(true);

    async function checkRoom() {
        try {
            const res = await fetch(`${process.env.API_BASE_URL}/api/check-room`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    roomId: roomId,
                    roomMode: mode
                })
            });
            const data = await res.json();
            setCheck(data.check);
        } catch {}
    }

    useEffect(() => {
        checkRoom();
        console.log('theme', theme)
        if (theme == -1 || check == false) {
            Swal.fire({
                title: 'You have no access to this page',
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    popup: 'bg-gradient-to-r from-[#510546]/40 to-[#6958be]/40'
                }
            }).then((res) => {
                if (res.isConfirmed) {
                    router.push('/dashboard/game', { scroll: false });
                }
            });
        }
        return () => {
            // cleanup
        }
    }, [router, theme, roomId, mode, check]);
    
    return (
        <AuthWrapper>
            <GameProvider>
            {
            theme !== -1 && check &&
            <div className='w-[88%] mx-auto text-center p-[1%] shadow-md rounded-3xl bg-[#311251]/80 top-[50%]  -translate-y-[50%] absolute'>

                    <div className='text-3xl font-black text-white m-4'>
                    <h1>Game</h1>
                    </div>

                    <div className="flex justify-around items-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900/70 to-gray-600/70 rounded-3xl shadow-md p-[1%] rotate-[90deg] min-[1280px]:rotate-0">
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
        </AuthWrapper>
  );
};

export default Game;