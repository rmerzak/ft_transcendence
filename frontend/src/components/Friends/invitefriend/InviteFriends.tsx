"use client";
import React, { useState } from "react";
import Piece from "./InviteFriendsItem";
import Image from "next/image";
import { Friendship } from "@/interfaces";
import InviteFriendsItem from "./InviteFriendsItem";


const InviteFriends = ({ friends }: { friends: Friendship[] }) => {
  return (
    <div className="text-gray-400 pb-6 bg-achievements md:w-[41%] mx-2 md:mt-0 mt-4">
      <div className="pb-1 text-gray-300 text-[16px]  font-thin w-full flex items-center justify-center pt-2">Friends Requests</div>
      <div className="border-b border-gray-200 w-[60px] mx-auto mb-4"></div>
      <div className="overflow-auto h-[430px] space-y-3 flex flex-col items-center">
        {friends.map((friend, index) => (
          <InviteFriendsItem key={index} friend={friend} />
        ))}
      </div>
     
    </div>
  )
}

export default InviteFriends;