'use client'
import React, { use, useContext, useEffect, useState } from "react";
import { ThumbsUp } from 'lucide-react';
import { ThumbsDown } from 'lucide-react';
import { Friendship, User } from "@/interfaces";
import { ContextGlobal } from "@/context/contex";
import { getUserInfoById } from "@/api/user/user";
import { getFriendList } from "@/api/friendship/friendship.api";

const InviteFriendsItem = ({ friend } : { friend: Friendship }) => {
    const {  profile,socket,setFriends,friends  } : any = useContext(ContextGlobal);
    function getFriends(number: number) {
        getFriendList().then((res) => {
          if (res?.data)
            setFriends((prev:any) => prev = res.data);
        }).catch((err) => { console.log(err) });
      }
    const handleAcceptFriend = (status:boolean) => {
        if(status){
            socket?.emit('friendAcceptRequest', friend.senderId);
            //getFriends(profile?.id);
        } 
        else {
            socket?.emit('removeFriend', friend.senderId);
            //setFriends((prev:any) => prev.filter((item:any) => item.senderId !== friend.senderId));
        }
    }
    return (
        
        (friend.status === 'PENDING' && profile.id !==  friend.sender.id ?
            <div className="relative text-white bg-achievements1 w-[50%] ">
                <img src="/bg-ping-pong.jpeg" alt="default pic" className="h-[60%] w-full rounded-t-2xl object-cover" />
                <div className="absolute flex items-center justify-center top1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <img src={profile?.id === friend.sender.id ? friend.receiver.image : friend.sender.image }  alt="default pic" className="w-[50%] h-[50%] rounded-full" />
                </div>
                
                <div className="text-white flex items-center justify-around w-full h-[50%]">
                <button onClick={()=> handleAcceptFriend(true)}><ThumbsUp size={20} strokeWidth={3}/></button>
                <button onClick={()=> handleAcceptFriend(false)}><ThumbsDown size={20} strokeWidth={3}/></button>
                </div>
            </div> : null)
    )
}

export default InviteFriendsItem