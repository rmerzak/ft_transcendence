'use client'
import React, { use, useContext, useEffect } from "react";
import { getFriendList } from "@/api/friendship/friendship.api";
import { ContextGlobal } from "@/context/contex";
import { get } from "https";
import ListOfFriends from "@/components/Friends/friends/ListOfFriends";
import InviteFriends from "@/components/Friends/invitefriend/InviteFriends";
import BlackList from "@/components/Friends/blockedFriends/BlackList";

const Friends = () => {
  const { profile, setProfile, setFriends, friends, socket }: any = useContext(ContextGlobal);
  function getFriends(number: number) {
    getFriendList(number).then((res) => {
      if (res.data)
        setFriends(res.data);
      console.log("friends inside 1", friends);
    }).catch((err) => { console.log(err) });
  }
  useEffect(() => {
    getFriends(profile?.id);
  
    const handleFriendAccept = (data: any) => {
      getFriends(profile?.id);
    };
  
    const handleFriendRequest = (data: any) => {
      getFriends(profile?.id);
    };
  
    const handleRemoveFriend = (data: any) => {
      getFriends(profile?.id);
    };
  
    socket?.on('AcceptRequest', handleFriendAccept);
    socket?.on('friendRequest', handleFriendRequest);
    socket?.on('removeFriend', handleRemoveFriend);
  
    // Cleanup function
    return () => {
      socket?.off('AcceptRequest', handleFriendAccept);
      socket?.off('friendRequest', handleFriendRequest);
      socket?.off('removeFriend', handleRemoveFriend);
    };
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
