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
      <div className="md:justify-between bg-profile p-4 mx-4">
        <h1 className="text-white font-bold text-3xl text-center mb-4">Friends</h1>
        <div className="flex  justify-center ">
            <ListOfFriends />
            <InviteFriends />
            <BlackList />
        </div>
      </div>
    )
  }
  
  export default Friends
  