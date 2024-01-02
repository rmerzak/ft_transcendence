'use client'
import React, { use, useContext, useEffect } from "react";
import ListOfFriends from "@/components/Friends/ListOfFriends";
import InviteFriends from "@/components/Friends/InviteFriends";
import BlackList from "@/components/Friends/BlackList";
import { getFriendList } from "@/api/friendship/friendship.api";
import { ContextGlobal } from "@/context/contex";
import { get } from "https";

const Friends = () => {
  const { profile, setProfile, setFriends, friends, socket }: any = useContext(ContextGlobal);
  function getFriends(number: number) {
    getFriendList(number).then((res) => {
      if (res.data)
        setFriends(res.data);
      console.log("friends inside ", friends);
    }).catch((err) => { console.log(err) });
  }
  useEffect(() => {
    getFriends(profile?.id);
    socket?.on('friendAcceptRequest', (data: any) => {
      console.log("friendAcceptRequest", data)
      getFriends(profile?.id);
    });
    socket?.on('friendRequest', (data: any) => {
      getFriends(profile?.id);
    });
    socket?.on('removeFriend', (data: any) => {
      getFriends(profile?.id);
    });

  }, [profile, socket]);
  return (
    <div className="bg-profile py-4 px-2 mx-4 ">
      <h1 className="text-white font-bold text-3xl text-center mb-4">Friends</h1>
      <div className="flex md:flex-row flex-col">
        <ListOfFriends friends={friends} />
        <InviteFriends friends={friends} />
        <BlackList friends={friends} />
      </div>
    </div>
  )
}

export default Friends
