"use client";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import axios from "axios";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./userOnline.css";

// import Swiper core and required modules
import { FreeMode, Pagination } from "swiper/modules";

interface friends {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
}

const UserOnline = () => {
  const [isResponsive, setIsResponsive] = useState(false);
  const [users, setUsers] = useState<friends[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get<friends[]>("http://localhost:3000/friendship");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    const checkIsResponsive = () => {
      const isResponsiveNow = window.innerWidth <= 390;
      setIsResponsive(isResponsiveNow);
    };

    // Initial check when the component mounts
    checkIsResponsive();

    // Event listener to check for changes in screen width
    window.addEventListener('resize', checkIsResponsive);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkIsResponsive);
    };
  }, []);

  function makeIstolong(user: any) {
    if (isResponsive == true && (user.firstName.length + user.lastName.length) >= 9) {
      return user.lastName;
    } else return user.firsName + " " + user.lastName;
  }
//some test here 

  return (
    <>
      <div className="flex justify-center items-center space-x-2">
        <input
          type="text"
          className="bg-gray-300 text-black rounded-full px-2 h-[32px] md:h-11 w-3/5 focus:outline-none text-xs md:text-base my-3"
          placeholder="Your placeholder text"
        />
        <button className="rounded-full text-white border w-[30%] md:w-1/5 md:h-11 text-xs md:text-base h-[32px]">
          Search
        </button>
      </div>
      <div className="my-5">
        <h1 className="text-white md:text-xl text-center">Online</h1>
        <div className="flex justify-center md:mt-2">
          <div className="mb-4 border-b border-white w-12 md:w-16"></div>
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
          <SwiperSlide key={index} className="swiper-slide">
            <div onClick={() => alert("hello")}>
              <Image
                src={user.avatar}
                alt={user.firstName}
                width={60}
                height={60}
                priority={true}
                className="h-[45px] w-[45px] md:h-[60px] md:w-[60px] rounded-full mx-auto hover:cursor-pointer"
              />
              <span className="w-2 md:w-3 bg-green-400 h-2 md:h-3 left-10 top-9 md:left-[82px] md:top-12 rounded-full absolute "></span>
              <p className={`text-white text-center text-xs md:text-base`}>
                {makeIstolong(user)}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
export default UserOnline;
