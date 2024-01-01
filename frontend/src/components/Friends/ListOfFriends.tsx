import React from "react";
import { PlusCircle } from "lucide-react";
import { MessagesSquare } from 'lucide-react';
import { Gamepad2 } from 'lucide-react';
import { XOctagon } from 'lucide-react';

import FriendItem from "./FriendItem";
import { Friendship } from "@/interfaces";



const ListOfFriends = ({ friends }: { friends: Friendship[] }) => {

  return (
    <div className="text-gray-400 pb-6 bg-achievements w-full md:w-[33%]">
      <div className="pb-1 text-gray-300 text-[15px] font-thin w-full flex items-center justify-center pt-2">List of Friends</div>
      <div className="border-b border-gray-200 w-[50px] mx-auto mb-7"></div>
      <div className="bg-achievements flex w-fill justify-between mx-3 mb-4 py-2">
        <div className="text-white text-[15px] font-bold text-center pl-2">Friends</div>
        <div className="text-white text-[15px] font-bold  text-center pr-2">Action</div>
      </div>

      <div className="overflow-auto h-[576px] space-y-3 flex flex-col ">
        {friends.map((item, index) => (
          <FriendItem key={index} friend={item} />
        ))}
      </div>
    </div>
  )
}

export default ListOfFriends