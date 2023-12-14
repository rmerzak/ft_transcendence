'use client'
import styles from '@/app/dashboard/game/page.module.css'
import Image from 'next/image'
import Link from 'next/link';
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { EffectCoverflow, Pagination } from 'swiper/modules';
import GameCanvas from './GameCanvas';

function GameFirstPage()
{
    return (
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

                        <Link href='#'>
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
                    <SwiperSlide>
                        <Image
                            // className={styles.button_icon}
                            src="/A2.png"
                            alt="A2"
                            width={500}
                            height={500}
                            priority={true}
                            draggable={false}
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image
                            // className={styles.button_icon}
                            src="/B2.png"
                            alt="B2"
                            width={500}
                            height={500}
                            priority={true}
                            draggable={false}
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image
                            // className={styles.button_icon}
                            src="/C2.png"
                            alt="C2"
                            width={500}
                            height={500}
                            priority={true}
                            draggable={false}
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image
                            // className={styles.button_icon}
                            src="/D2.png"
                            alt="D2"
                            width={500}
                            height={500}
                            priority={true}
                            draggable={false}
                        />
                    </SwiperSlide>
                </Swiper>

                <h1 className={styles.choose}>
                    Preview
                </h1>

                <div className={styles.preview}>
                    <GameCanvas />
                </div>
            </div>
        </div>
    );
}

export default GameFirstPage;