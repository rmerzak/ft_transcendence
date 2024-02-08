"use client";
import { useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./userOnline.css";

// import Swiper core and required modules
import { FreeMode, Pagination } from "swiper/modules";
// import { getFriendList } from "@/api/friendship/friendship.api";
import { ContextGlobal } from "@/context/contex";
import UserItem from "./UserItem";

const UserOnline = () => {
  const { friends } = useContext(ContextGlobal);

  // function getFriends() {
  //   getFriendList()
  //     .then((res) => {
  //       if (res.data) {
  //         console.log("getFriends: ", res.data);
  //         setFriends(res.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  useEffect(() => {
    // if (profile?.id && !friends && socket) {
    //   socket?.on("blockFriend", (res) => {
    //     console.log("here: 1");
    //     if (res) {
    //       console.log("blockFriend: ", res);
    //       getFriends();
    //     }
    //   });
    //   socket?.on("unblockFriend", (res) => {
    //     console.log("here: 2");
    //     if (res) {
    //       console.log("unblockFriend: ", res);
    //       getFriends();
    //     }
    //   });

    //   return () => {
    //     socket?.off("blockFriendd");
    //     socket?.off("unblockFriendd");
    //   }
    // }
  }, [friends]);

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