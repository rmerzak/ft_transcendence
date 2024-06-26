'use client'
import React, { use, useContext, useEffect } from "react";
import { getFriendList } from "@/api/friendship/friendship.api";
import { ContextGlobal } from "@/context/contex";
import ListOfFriends from "@/components/Friends/friends/ListOfFriends";
import InviteFriends from "@/components/Friends/invitefriend/InviteFriends";
import BlackList from "@/components/Friends/blockedFriends/BlackList";
import AuthWrapper from "@/components/auth/AuthWrapper";

const Friends = () => {
  const { profile, setProfile, setFriends, friends, socket }: any = useContext(ContextGlobal);
  function getFriends(number: number) {
    getFriendList().then((res) => {
      if (res?.data)
        setFriends(res.data);
    }).catch((err) => {  });
  }
  useEffect(() => {

    getFriends(profile?.id);
  
    const handleFriendAccept = (data: any) => {

      if(data.status === true)
        getFriends(profile?.id);
    };
  
    const handleFriendRequest = (data: any) => {
      if(data.status === true)
        getFriends(profile?.id);
    };
  
    const handleRemoveFriend = (data: any) => {
      if(data.status === true)
        getFriends(profile?.id);
    };
  
    socket?.on('AcceptRequest', handleFriendAccept);
    socket?.on('friendAcceptRequest', handleFriendAccept);
    socket?.on('removeFriend', handleRemoveFriend);
    socket?.on('friendRequest', handleFriendRequest);
    socket?.on('blockFriend', handleRemoveFriend);
    socket?.on('unblockFriend', handleRemoveFriend);
  
    // Cleanup function
    return () => {
      socket?.off('AcceptRequest', handleFriendAccept);
      socket?.off('friendRequest', handleFriendRequest);
      socket?.off('removeFriend', handleRemoveFriend);
      socket?.off('blockFriend', handleRemoveFriend);
      socket?.off('unblockFriend', handleRemoveFriend);
      socket?.off('friendAcceptRequest', handleFriendAccept);
    };
  }, [profile, socket]);
  
  return (
    <AuthWrapper>
      <div className="h-[95%] md:h-full bg-profile py-4 px-2 mx-4 overflow-auto">
        <h1 className="text-white font-bold text-3xl text-center mb-4">Friends</h1>
        <div className="flex md:flex-row flex-col">
          <ListOfFriends friends={friends} />
          <InviteFriends friends={friends} />
          <BlackList friends={friends} />
        </div>
      </div>
    </AuthWrapper>
  )
}

export default Friends
