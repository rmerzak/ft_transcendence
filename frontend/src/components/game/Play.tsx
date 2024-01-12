'use client'
import Image from 'next/image'
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import { themeAtom } from './theme';
import { useSetAtom } from 'jotai';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './styles.css';
import { ContextGlobal } from '@/context/contex';

const img = ['t0', 't1', 't2', 't3', 't4', 't5'];

function Play()
{
    const { profile }: any = useContext(ContextGlobal);
    const [isPlaying, setIsPlaying] = useState(false);
    const router = useRouter();
    const createRoom = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();

            if (data.roomId)
                router.push(`/dashboard/game/${data.roomId}`, { scroll: false });
        } catch {}
    }

    const checkIfUserPlaying = async (id: number): Promise<boolean> => {
        try {
            const res = await fetch('http://localhost:3000/api/players', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playerId: id }),
            });
            const data = await res.json();
            return data.isPlaying as boolean ;
        } catch {}
        return false as boolean;
    }

    const setTheme = useSetAtom(themeAtom);
    const handleTheme = (index: number) => {
        setTheme(index);
    }

    useEffect(() => {
        if (profile.id !== -1) {
            checkIfUserPlaying(profile.id).then((res) => {
                setIsPlaying(res);
            });
        }
    }, [profile.id])

    return (
        <>
            <div className='flex justify-between'>

                <div className='w-1/4 shadow-2xl'>
                <div className="card w-96 glass">
                    <figure>
                        <Image
                            className="bg-[#ffffff]"
                            src="/pong.gif"
                            alt="car!"
                            width={500}
                            height={300}
                            draggable={false}
                            priority={true}
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="inline-block card-title font-sans text-3xl pb-4 border-b-[1px] text-[#ffffff]/70">
                            PingPong
                        </h2>
                        <p className='font-sans text-lg pt-10 pb-10 text-[#ffffff]/70'>
                            Play PingPong online on the #1 site
                        </p>
                        <div className="card-actions justify-between">
                            <button
                                disabled={isPlaying}
                                onClick={createRoom}
                                className="btn btn-active btn-neutral border-0 bg-[#811B77] text-[#ffffff]/70"
                            >
                                    Play Online
                            </button>

                            <Link
                                href='/dashboard/game/bot'
                                className="btn btn-active btn-ghost border-0 text-[#ffffff]/70"
                            >
                                Play Bot
                            </Link>
                        </div>
                        
                    </div>
                </div>
     
                    
                </div>

                <div  className='w-3/4 bg-gradient-to-r from-slate-500/40 to-yellow-100/30 rounded-3xl shadow-2xl flex flex-col items-center'>
                    
                    <h1 className='inline-block font-sans text-xl p-4 border-b-[1px] text-[#ffffff]/80'>
                        Maps
                    </h1>

                    <Swiper
                        onSlideChange={ (swiper) => { handleTheme(swiper.realIndex); } }
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        pagination={false}
                        modules={[EffectCoverflow, Pagination]}
                        className="mySwiper"
                        initialSlide={1}
                        lazyPreloaderClass='lazy-preloader'
                    >
                        {img.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Image
                                    src={`/game/${item}.gif`}
                                    alt={item}
                                    width={300}
                                    height={300}
                                    priority={true}
                                    draggable={false}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    );
}

export default Play;