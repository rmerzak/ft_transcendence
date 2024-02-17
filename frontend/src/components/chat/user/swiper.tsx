import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./userOnline.css"

import { FreeMode, Pagination } from "swiper/modules";
import { Friendship } from "@/interfaces";
import UserItem from "./UserItem";

const SwiperFC = ({ friends }: { friends: Friendship[] }) => {
  return (
    <Swiper
      slidesPerView={4}
      spaceBetween={20}
      freeMode={true}
      modules={[FreeMode, Pagination]}
      className="chatSwiper"
    >
      {friends.length > 0 ? friends.map((user, index) => (
        <SwiperSlide key={index} className="chatSwiperSlide">
          <UserItem friend={user} />
        </SwiperSlide>
      )) : <div className="flex justify-center items-center"><h1 className="text-white text-2xl">You have no friends</h1></div>}
    </Swiper>
  )
}

export default SwiperFC