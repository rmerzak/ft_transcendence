'use client'
import Image from 'next/image'
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { themeAtom } from './atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { ContextGlobal } from '@/context/contex';
import { toast } from 'react-toastify';
import GameSwiper from './GameSwiper';

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
            <div className='flex flex-col-reverse items-center gap-5 min-[2560px]:flex-row justify-between'>

                {/* <div className='w-1/4 shadow-2xl bg-red-500'> */}
                    <div className="card min-[2560px]:w-96 w-3/4 glass flex items-center overflow-hidden">
                        <div className=' w-full max-w-96'>
                            <figure>
                                <Image
                                    className="bg-[#ffffff] hidden min-[2560px]:block"
                                    src="/game/pong.gif"
                                    alt="car!"
                                    width={500}
                                    height={300}
                                    draggable={false}
                                    priority={true}
                                />
                            </figure>
                            <div className="card-body max-sm:p-5">
                                <h2 className="inline-block card-title font-sans text-xl sm:text-3xl pb-4 border-b-[1px] text-[#ffffff]/70">
                                    PingPong
                                </h2>
                                <p className='font-sans text-[15px] sm:text-lg p-4 sm:py-10 sm:px-4 text-[#ffffff]/70'>
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
                                        className="btn btn-active text-[12px] w-[120px] sm:text-[15px] btn-neutral border-0 bg-[#811B77] text-[#ffffff]/70"
                                    >
                                            Play Online
                                    </button>

                                    <Link
                                        href='/dashboard/game/bot'
                                        className="btn btn-active text-[12px] btn-ghost border-0 text-[#ffffff]/70 w-[120px] sm:text-[15px]"
                                    >
                                        Play Bot
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                {/* </div> */}

                <div  className='w-3/4 bg-gradient-to-r from-slate-500/40 to-yellow-100/30 rounded-3xl shadow-2xl flex flex-col min-[2560px]:justify-around min-[2560px]:h-[596px]  items-center pb-6 bg-red-500'>
                    <h1 className='inline-block font-sans text-sm sm:text-xl p-4 border-b-[1px] text-[#ffffff]/80'>
                        Maps
                    </h1>
                    <GameSwiper />
                </div>
            </div>
        </>
    );
}

export default Play;