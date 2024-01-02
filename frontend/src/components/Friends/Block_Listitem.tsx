'use client'
import React, { use, useContext, useEffect, useState } from "react";
import { LockKeyhole } from 'lucide-react';
import { Friendship, User } from "@/interfaces";
import { ContextGlobal } from "@/context/contex";
import { getUserInfoById } from "@/api/user/user";

const Block_Listitem = ({friend} : {friend:Friendship}) => {
    const {  profile, friends  } = useContext(ContextGlobal);
    const [user, setUser] = useState<User>()
    useEffect(() => {
        getUserInfoById((profile?.id ===  friend.senderId ? friend.receiverId : friend.senderId)).then((res) => {
            if (res.data)
              setUser(res.data);
          }).catch((err) => { console.log(err) });
    }, [friend,friends]);
    return (
        friend?.block === true && ( (friend.blockBy === 'SENDER' && profile?.id === friend.senderId ) || (friend.blockBy === 'RECEIVER' && profile?.id === friend.receiverId ))  ?
        <div className="bg-black-list flex mx-2 items-center px-1">
            <div className="w-[14%] my-1 rounded-full">
                   <img src={user?.image} alt="default pic" className="rounded-full"/>
                </div>
                <div className="text-gray-200 text-[15px] font-thin">{user?.username}</div>
                <button className="ml-auto md:mr-0 mr-2"><LockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF"/>
                </button>
            </div> : null
    )
}

export default Block_Listitem