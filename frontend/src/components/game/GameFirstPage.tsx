'use client'
import styles from '@/app/dashboard/game/page.module.css'
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRouter } from 'next/navigation';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { EffectCoverflow, Pagination } from 'swiper/modules';
import GameCanvas from './GameCanvas';


export const userContext = React.createContext(0);


const img = ['A2', 'B2', 'C2', 'D2'];

function GameFirstPage()
{
    
    const [imgIndex, setImgIndex] = useState<number>(1);

    const handleSlideChange = (swiper : any) => {
        // console.log(swiper.realIndex);
        setImgIndex(swiper.realIndex);
      };
      
    return (
        <>
            <div className={styles.container_for_contents}>
                <div className={styles.left_content}>
                    <h1 className={styles.script}>
                        Play PingPong<br />Online<br />on the #1 Site!
                    </h1>
                    <Image
                        className={styles.scketch}
                        src="/pong.gif"
                        alt="Scketch of PingPong"
                        width={500}
                        height={500}
                        draggable={false}
                        priority={true}
                    />

                    <div className={styles.type_cont}>
                        <div className={styles.button_container}>
                            <h1 className={styles.choose}>
                                    Online
                            </h1>

                            <Link href={`/dashboard/game/`+imgIndex}>
                                <div className={styles.button_online}>
                                    <Image
                                        className={styles.button_icon}
                                        src="/paddle.png"
                                        alt="Scketch of PingPong"
                                        width={50}
                                        height={50}
                                        draggable={false}
                                        priority={true}
                                    />
                                        Play Online
                                </div>
                            </Link>
                        </div>

                        <div className={styles.button_container}>
                            <h1 className={styles.choose}>
                                    Bot
                            </h1>

                            <Link href='#'>
                                <button className={styles.button_bot}>
                                    <Image
                                        className={styles.button_icon}
                                        src="/bot.png"
                                        alt="Scketch of PingPong"
                                        width={50}
                                        height={50}
                                        priority={true}
                                        draggable={false}
                                    />
                                        Play a Bot
                                </button>
                            </Link>
                        </div>
                    </div>
     
                    
                </div>

                <div  className={styles.right_content}>
                    <h1 className={styles.choose}>
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

                    <h1 className={styles.choose}>
                        Preview
                    </h1>
                    {/* change the value of userContex */}
                    <userContext.Provider value={imgIndex}>
                        <GameCanvas imgIndex={imgIndex} />
                    </userContext.Provider>
                    {/* <div className={styles.preview}>
                        <GameCanvas imgIndex={value} />
                    </div> */}
                </div>
            </div>
        </>
    );
}

export default GameFirstPage;