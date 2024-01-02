'use client'
import React, { use, useContext, useEffect, useState } from "react";
import { ThumbsUp } from 'lucide-react';
import { ThumbsDown } from 'lucide-react';
import { Friendship, User } from "@/interfaces";
import { ContextGlobal } from "@/context/contex";
import { getUserInfoById } from "@/api/user/user";
import { getFriendList } from "@/api/friendship/friendship.api";

const InviteFriendsItem = ({ friend } : { friend: Friendship }) => {
    const {  profile, friends,socket,setFriends  } : any = useContext(ContextGlobal);
    const [user, setUser] = useState<User>();
    function getFriends(number: number) {
        getFriendList(number).then((res) => {
          if (res.data)
            setFriends(res.data);
          console.log("friends inside ", friends);
        }).catch((err) => { console.log(err) });
      }
    const handleAcceptFriend = () => {
        socket?.emit('friendAcceptRequest', friend.senderId);
        getFriends(profile?.id);
    }
    const handleDeclineFriend = () => {
        socket?.emit('removeFriend', friend.senderId);
        getFriends(profile?.id);
    }
    useEffect(() => {
        getUserInfoById((profile?.id ===  friend.senderId ? friend.receiverId : friend.senderId)).then((res) => {
            if (res.data)
              setUser(res.data);
          }).catch((err) => { console.log(err) });
    }, [friend]);
    return (
        
        (friend.status === 'PENDING' && friend.receiverId !== user?.id ?
            <div className="relative text-white bg-achievements1 w-[50%] ">
                <img src="/bg-ping-pong.jpeg" alt="default pic" className="h-[60%] w-full rounded-t-2xl object-cover" />
                <div className="absolute flex items-center justify-center top1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <img src={user?.image} alt="default pic" className="w-[50%] h-[50%] rounded-full" />
                </div>
                
                <div className="text-white flex items-center justify-around w-full h-[50%]">
                <button onClick={handleAcceptFriend}><ThumbsUp size={20} strokeWidth={3}/></button>
                <h1 className="font-thin text-[12px] md:text-[15px] mt-1">{user?.username}</h1>
                <button onClick={handleDeclineFriend}><ThumbsDown size={20} strokeWidth={3}/></button></div>
            </div> : null)
    )
}

export default InviteFriendsItem