'use client'
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './styles.css';
import { EffectCoverflow, Pagination } from 'swiper/modules';

export const userContext = React.createContext(0);


const img = ['A2', 'B2', 'C2', 'D2', 'E2', 'F2'];

function Play()
{
    const [room, setRoom] = useState<string>('');
    const createRoom = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            setRoom(data.roomId);
        } catch {}
    }

    const [imgIndex, setImgIndex] = useState<number>(1);
    const handleSlideChange = (swiper : any) => {
        setImgIndex(swiper.realIndex);
      };
      
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
                            height={500}
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
                                onMouseOver={createRoom}
                                className="btn btn-active btn-neutral border-0 bg-[#811B77] text-[#ffffff]/70">
                                <Link href={{
                                    pathname: `/dashboard/game/${room}`,
                                    query: { theme: imgIndex },
                                
                                }}>
                                    Play Online
                                </Link>
                            </button>
                            <button
                                className="btn btn-active btn-ghost border-0 text-[#ffffff]/70">
                                <Link href='#'>
                                    Play Bot
                                </Link>
                            </button>
                        </div>
                        
                    </div>
                </div>
     
                    
                </div>

                <div  className='w-3/4 bg-gradient-to-r from-slate-500/40 to-yellow-100/30 rounded-3xl shadow-2xl flex flex-col items-center'>
                    
                    <h1 className='inline-block font-sans text-xl p-4 border-b-[1px] text-[#ffffff]/80'>
                        Maps
                    </h1>

                    <Swiper
                        onSlideChange={handleSlideChange}
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
                    >
                        {img.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Image
                                    src={`/${item}.png`}
                                    alt={item}
                                    width={500}
                                    height={500}
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