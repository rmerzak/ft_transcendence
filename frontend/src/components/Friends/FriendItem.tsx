// FriendItem.js
'use client'
import React, { use, useContext, useEffect, useState } from 'react';
import { MessagesSquare, Gamepad2, XOctagon } from 'lucide-react';
import { Friendship, User } from '@/interfaces';
import { getUserInfoById } from '@/api/user/user';
import { ContextGlobal } from '@/context/contex';

const FriendItem = ({ friend } : { friend: Friendship }) => {
  const {  profile, friends  } = useContext(ContextGlobal);

  const [user, setUser] = useState<User>()
  useEffect(() => {
    getUserInfoById((profile?.id ===  friend.senderId ? friend.receiverId : friend.senderId)).then((res) => {
      if (res.data)
        setUser(res.data);
      console.log("user ", user);
    }).catch((err) => { console.log(err) });
  }, [friend,friends]);
  return (
    (friend.status === 'ACCEPTED' && !friend.blocked) ? (
    <div className={`text-white bg-achievements1 flex items-center justify-between py-1 mx-3`}>
      <div className="flex items-center">
        <div className="relative w-[30px] h-[30px] md:w-[40px] md:h-[40px] ml-2 mb-2 rounded-full">
          <img src={user?.image} className="w-[40px] h-[40px] rounded-full " alt="default pic" />
          <div
            className={`absolute left-5 top-10  -translate-x-1/2 -translate-y-1/2 text-[8px] h-[8px] w-[8px] rounded-full ${user?.status === 'ONLINE' ? 'bg-custom-green' : user?.status === 'IN_GAME' ? 'bg-orange-400' : 'bg-gray-400'}`}> 
            </div>
        </div>
        <div className="text-gray-200 text-[16px] font-thin pl-1">{user?.username}</div>
      </div>
      <div className="                                    ">
        <button className="md:px-2 px-1">
          <MessagesSquare />
        </button>
        <button className="md:px-2 px-1">
          <Gamepad2 />
        </button>
        <button className="md:px-2 px-1">
          <XOctagon />
        </button>
      </div>
    </div>) : null
  );
};

export default FriendItem;
