'use client'
import React, { use, useContext, useEffect, useState } from "react";
import { LockKeyhole } from 'lucide-react';
import { Friendship, User } from "@/interfaces";
import { ContextGlobal } from "@/context/contex";
import { getUserInfoById } from "@/api/user/user";

const Block_Listitem = ({friend} : {friend:any}) => {
    const {  profile, friends  } : any = useContext(ContextGlobal);
    return (
        friend?.block === true && ( (friend.blockBy === 'SENDER' && profile?.id === friend.senderId ) || (friend.blockBy === 'RECEIVER' && profile?.id === friend.receiverId ))  ?
        <div className="bg-black-list flex mx-2 items-center px-1">
            <div className="w-[14%] my-1 rounded-full">
                   <img src={profile?.id === friend.sender.id ? friend.receiver.image : friend.sender.image } alt="default pic" className="rounded-full"/>
                </div>
                <div className="text-gray-200 text-[15px] font-thin">{profile?.id === friend.sender.id ? friend.receiver.username : friend.sender.username}</div>
                <button className="ml-auto md:mr-0 mr-2"><LockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF"/>
                </button>
            </div> : null
    )
}

export default Block_Listitem