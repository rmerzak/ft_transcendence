"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./userOnline.css";

// import Swiper core and required modules
import { FreeMode, Pagination } from "swiper/modules";

const users = [
  { name: "John Doe", avatar: "https://i.pravatar.cc/300" },
  { name: "Jane Doe", avatar: "https://i.pravatar.cc/301" },
  { name: "Bob Smith", avatar: "https://i.pravatar.cc/302" },
  { name: "Alice Johnson", avatar: "https://i.pravatar.cc/303" },
  { name: "Kate Williams", avatar: "https://i.pravatar.cc/304" },
  { name: "Mike Brown", avatar: "https://i.pravatar.cc/305" },
    { name: "John Doe", avatar: "https://i.pravatar.cc/300" },
    { name: "Jane Doe", avatar: "https://i.pravatar.cc/301" },
    { name: "Bob Smith", avatar: "https://i.pravatar.cc/302" },
    { name: "Alice Johnson", avatar: "https://i.pravatar.cc/303" },
    { name: "Kate Williams", avatar: "https://i.pravatar.cc/304" },
    { name: "Mike Brown", avatar: "https://i.pravatar.cc/305" },
    { name: "John Doe", avatar: "https://i.pravatar.cc/300" },
    { name: "Jane Doe", avatar: "https://i.pravatar.cc/301" },
    { name: "Bob Smith", avatar: "https://i.pravatar.cc/302" },
    { name: "Alice Johnson", avatar: "https://i.pravatar.cc/303" },
    { name: "Kate Williams", avatar: "https://i.pravatar.cc/304" },
    { name: "Mike Brown", avatar: "https://i.pravatar.cc/305" },
    { name: "John Doe", avatar: "https://i.pravatar.cc/300" },
    { name: "Jane Doe", avatar: "https://i.pravatar.cc/301" },
    { name: "Bob Smith", avatar: "https://i.pravatar.cc/302" },
    { name: "Alice Johnson", avatar: "https://i.pravatar.cc/303" },
    { name: "Kate Williams", avatar: "https://i.pravatar.cc/304" },
    { name: "Mike Brown", avatar: "https://i.pravatar.cc/305" },
    { name: "John Doe", avatar: "https://i.pravatar.cc/300" },
    { name: "Jane Doe", avatar: "https://i.pravatar.cc/301" },
    { name: "Bob Smith", avatar: "https://i.pravatar.cc/302" },
    { name: "Alice Johnson", avatar: "https://i.pravatar.cc/303" },
    { name: "Kate Williams", avatar: "https://i.pravatar.cc/304" },
    { name: "Mike Brown", avatar: "https://i.pravatar.cc/305" },
];

const userOnline = () => {
  return (
      <>
        <div className="flex justify-center items-center space-x-2">
          <input
            type="text"
            className="bg-gray-300 text-black rounded-full px-2 h-11 w-3/5 focus:outline-none my-3"
            placeholder="Your placeholder text"
          />
          <button className="rounded-full text-white border w-1/5 h-11">
            Search
          </button>
        </div>
        <div className="my-5">
          <h1 className="text-white text-xl  text-center">Online</h1>
          <div className="flex justify-center mt-2">
            <div className="mb-4 border-b border-white w-16"></div>
          </div>
        </div>
        <Swiper
          slidesPerView={4}
          spaceBetween={20}
          freeMode={true}
          modules={[FreeMode, Pagination]}
          className="mySwiper"
        >
          {users.map((user, index) => (
            <SwiperSlide key={index}  className="swiper-slide">
              <div onClick={() => alert("hello")}>
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={60}
                  height={60}
                  priority={true}
                  className="rounded-full mx-auto hover:cursor-pointer"
                />
                <span className="w-3 bg-green-400 h-3 left-[82px] top-12 rounded-full absolute "></span>
                <p className="text-white text-center">{user.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
  );
};
export default userOnline;
