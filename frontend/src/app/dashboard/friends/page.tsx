import { PlusCircle } from "lucide-react";
import { MessagesSquare } from 'lucide-react';
import { Gamepad2 } from 'lucide-react';
import { XOctagon } from 'lucide-react';
import React from "react";
import ListOfFriends from "@/components/Friends/ListOfFriends";
import InviteFriends from "@/components/Friends/InviteFriends";
import BlackList from "@/components/Friends/BlackList";

const Friends = () => {
    return (
      <div className="bg-profile py-4 px-2 mx-4 ">
        <h1 className="text-white font-bold text-3xl text-center mb-4">Friends</h1>
        <div className="flex md:flex-row flex-col">
            <ListOfFriends />
            <InviteFriends />
            <BlackList />
        </div>
      </div>
    )
  }
  
  export default Friends
  