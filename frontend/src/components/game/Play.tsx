'use client'
import Image from 'next/image'
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { themeAtom } from './atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { ContextGlobal } from '@/context/contex';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import { RiPingPongLine } from 'react-icons/ri';
import { FaRobot } from 'react-icons/fa';
// import GameSwiper from './GameSwiper';
const GameSwiper = dynamic(() => import('./GameSwiper'), { ssr: false });

function Play()
{
    const { profile }: any = useContext(ContextGlobal);
    const [ isPlaying, setIsPlaying ] = useState(false);

    const router = useRouter();
    const createRoom = async () => {
        try {
            const res = await fetch(`${process.env.API_BASE_URL}/api/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await res.json();

            if (data.roomId)
                router.push(`/dashboard/game/${data.roomId}`, { scroll: false });
        } catch {}
    }
    
    const setTheme = useSetAtom(themeAtom);
    const theme = useAtomValue(themeAtom);
    useEffect(() => {
        const eventSource = new EventSource(`${process.env.API_BASE_URL}/api/is-playing`, {
          withCredentials: true,
        });

        eventSource.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data);
                parsedData.forEach((player: { playerId: number, isPlaying: boolean }) => {
                    if (player.isPlaying && player.playerId === profile.id) {
                        toast.error('You are already playing!', { autoClose: 500 })
                        setIsPlaying(true);
                    } else if (!player.isPlaying && player.playerId === profile.id) {
                        setIsPlaying(false);
                    }
                });
            } catch {}
        };

        return () => {
          eventSource.close();
        };

      }, [profile.id]);

    return (
        <>
            <div className='flex flex-col-reverse items-center gap-5 justify-between'>

                <div className='w-3/4'>
                    <div className="card glass flex items-center overflow-hidden">
                        <div className=' w-full max-w-96'>
                            <div className="card-body max-sm:p-5">
                                <h2 className="inline-block card-title font-inter text-xl sm:text-3xl pb-4 border-b-[1px] text-[#ffffff]/70">
                                    PingPong
                                </h2>
                                <p className='font-inter text-[15px] sm:text-lg p-4 sm:py-10 sm:px-4 text-[#ffffff]/70'>
                                    Play PingPong online on the #1 site
                                </p>
                                <div className="card-actions sm:justify-between justify-center flex flex-wrap items-center">
                                    <button
                                        disabled={isPlaying}
                                        onClick={ () => {
                                            createRoom();
                                            if (theme === -1)
                                                setTheme(1);
                                            }
                                        }
                                        className="flex btn btn-active w-[150px] h-12 text-[12px] sm:text-[15px] btn-neutral border-0 bg-[#811B77] text-[#ffffff]/70"
                                    >
                                        <RiPingPongLine size={20} />
                                        <p className='font-inter text-md'> Play Online </p>   
                                    </button>

                                    <Link
                                        href='/dashboard/game/bot'
                                        className="btn btn-active text-[12px] btn-ghost border-0 text-[#ffffff]/70 w-[150px] h-12 sm:text-[15px]"
                                    >
                                        <FaRobot size={20}/>
                                        <p className='font-inter text-md'> Play Bot </p> 
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div  className='w-3/4 bg-[#5D5959]/30 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col justify-around h-[596px]  items-center pb-6'>
                    <h1 className='inline-block font-inter text-sm sm:text-xl p-4 border-b-[1px] text-[#ffffff]/80'>
                        Maps
                    </h1>
                    <GameSwiper />
                    <h1 className='inline-block font-inter text-sm sm:text-xl p-4 border-b-[1px] text-[#ffffff]/80'>
                        How to play
                    </h1>
                    <div className='flex items-center justify-around text-white/80 w-full'>
                        <div className="flex justify-center items-center  m-4">
                            <p className="text-md mr-2"> Press</p>
                            <kbd className="kbd bg-[#811B77]/50 w-10 h-10">▲</kbd>
                            <p className="text-md ml-2"> to Move Up</p>
                        </div>
                        <div className="flex justify-center items-center  m-4">
                            <p className="text-md mr-2"> Press</p>
                            <kbd className="kbd bg-[#811B77]/50 w-10 h-10 ">▼</kbd>
                            <p className="text-md ml-2"> to Move Down</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Play;