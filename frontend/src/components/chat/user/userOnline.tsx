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
        {friends.length > 0 ? friends.map((user, index) => (
          <SwiperSlide key={index} className="swiper-slide">
              <UserItem friend={user} />
          </SwiperSlide>
        )) : <div className="flex justify-center items-center"><h1 className="text-white text-2xl">You have no friends</h1></div>}
      </Swiper>
    </>
  );
};
export default UserOnline;