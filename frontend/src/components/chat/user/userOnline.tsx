"use client";
import { useContext, useEffect } from "react";
import dynamic from 'next/dynamic';
const SwiperFC = dynamic(() => import('./swiper'), { ssr: false });
import { ContextGlobal } from "@/context/contex";
import { getFriendList } from "@/api/friendship/friendship.api";
// import "./userOnline.css";

const UserOnline = () => {
  const { friends, setFriends, profile, socket } = useContext(ContextGlobal);

  function getFriends() {
    getFriendList().then((res) => {
      if (res?.data && res?.data.length > 0) {
        setFriends(res?.data);
      }
    })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (profile?.id && socket) {
      getFriends();
      socket?.on("blockUserOnline", (res) => {
        if (res) {
          getFriends();
        }
      });
      socket?.on("unblockUserOnline", (res) => {
        if (res) {
          getFriends();
        }
      });

      return () => {
        socket?.off("blockUserOnline");
        socket?.off("blockUserOnline");
      }
    }
  }, [profile, socket]);

  return (
    <>
      <div className="">
        <div className="">
          <h1 className="text-white md:text-xl text-center">Online</h1>
          <div className="flex justify-center mt-1">
            <div className="mb-3 border-b border-white w-6 md:w-10"></div>
          </div>
        </div>
        <SwiperFC friends={friends} />
      </div>
    </>
  );
};
export default UserOnline;