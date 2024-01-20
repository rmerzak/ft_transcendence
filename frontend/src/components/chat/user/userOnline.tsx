"use client";
import { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./userOnline.css";

// import Swiper core and required modules
import { FreeMode, Pagination } from "swiper/modules";
import { getFriendList } from "@/api/friendship/friendship.api";
import { ContextGlobal } from "@/context/contex";
import UserItem from "./UserItem";

const UserOnline = () => {
  const { profile, friends, setFriends, socket } = useContext(ContextGlobal);

  function getFriends() {
    getFriendList()
      .then((res) => {
        if (res.data) {
          console.log("getFriends: ", res.data);
          setFriends(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {

        socket?.on("blockFriend", (res) => {
          if (res) {
            console.log("blockFriend: ");
            getFriends();
          }
        });
        socket?.on("unblockFriend", (res) => {
          if (res) {
            console.log("unblockFriend: ");
            getFriends();
          }
        });
    
    // console.log("friends: ", friends);
    return () => {
      socket?.off("blockFriend");
      socket?.off("unblockFriend");
    }
  }, [profile?.id, socket, friends]);

  return (
    <>
    <div className="">
      <div className="">
        <h1 className="text-white md:text-xl text-center">Online</h1>
        <div className="flex justify-center mt-1">
          <div className="mb-3 border-b border-white w-6 md:w-10"></div>
        </div>
      </div>
      <Swiper
        slidesPerView={4}
        spaceBetween={20}
        freeMode={true}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        {friends.length > 0 ? friends.map((user, index) => (
          <SwiperSlide key={index} className="swiper-slide">
              <UserItem friend={user} />
          </SwiperSlide>
        )) : <div className="flex justify-center items-center"><h1 className="text-white text-2xl">You have no friends</h1></div>}
      </Swiper>
    </div>
    </>
  );
};
export default UserOnline;

      {/* <div className="flex justify-center items-center space-x-2">
        <input
          type="text"
          className="bg-gray-300 text-black rounded-full px-2 h-[32px] md:h-11 w-3/5 focus:outline-none text-xs md:text-base my-3"
          placeholder="Your placeholder text"
        />
        <button className="rounded-full text-white border w-[30%] md:w-1/5 md:h-11 text-xs md:text-base h-[32px]">
          Search
        </button>
      </div> */}