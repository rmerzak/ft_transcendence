'use client'
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './styles.css';
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { useAtomValue, useSetAtom } from 'jotai';
import { themeAtom } from './theme';
import { botThemeAtom } from './theme';


const img : string[] = ['t0', 't1', 't2', 't3', 't4', 't5'];

function GameSwiper()
{

    const setTheme = useSetAtom(themeAtom);
    const setBotTheme = useSetAtom(botThemeAtom);
    // const theme = useAtomValue(themeAtom);

    return (
        <Swiper
            onSlideChange={ (swiper) => { setTheme(swiper.realIndex); setBotTheme(swiper.realIndex) } }
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
                        src={`/game/${item}.png`}
                        alt={item}
                        width={300}
                        height={300}
                        priority={true}
                        draggable={false}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default GameSwiper;

