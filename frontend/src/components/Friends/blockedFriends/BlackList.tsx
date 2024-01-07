"use client";
import React, { useState } from "react";
import { LockKeyhole } from 'lucide-react';
import Block_Listitem from "./Block_Listitem";
import { Friendship } from "@/interfaces";

export const BlackList = ({ friends }: { friends: Friendship[] }) => {
  return (
    <div className="text-gray-400 pb-6 bg-achievements md:w-[24%] md:mt-1 mt-2">
      <div className="pb-1 text-gray-300 text-[15px] font-thin w-full flex items-center justify-center pt-2">Black List</div>
      <div className="border-b border-gray-200 w-[30px] mx-auto mb-7"></div>
      <div className="overflow-auto h-[640px] space-y-3 flex flex-col ">
        {friends.map((friend, index) => (
          <Block_Listitem key={index} friend={friend} />
        ))}
      </div>
    </div>
  )
}

export default BlackList