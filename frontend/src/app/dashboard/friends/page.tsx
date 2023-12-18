import { PlusCircle } from "lucide-react";
import { MessagesSquare } from 'lucide-react';
import { Gamepad2 } from 'lucide-react';
import { XOctagon } from 'lucide-react';
import React from "react";
import ListOfFriends from "@/components/Friends/ListOfFriends";

const Friends = () => {
    return (
      <div className="flex justify-between bg-profile p-4 mx-4">
          <ListOfFriends />
      </div>
    )
  }
  
  export default Friends
  