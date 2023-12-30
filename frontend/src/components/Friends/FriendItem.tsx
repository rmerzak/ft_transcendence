// FriendItem.js
import React from 'react';
import { MessagesSquare, Gamepad2, XOctagon } from 'lucide-react';

enum statue {
    ONLINE = 'online',
    OFFLINE = 'offline',
    IN_GAME = 'in game',
}

const FriendItem = ({ name, statues, pic } : { name: string, statues: statue, pic: string }) => {
  return (
    <div className={`text-white bg-achievements1 flex items-center justify-between py-1 mx-3`}>
      <div className="flex items-center">
        <div className="relative w-[30px] h-[30px] md:w-[40px] md:h-[40px] ml-2 mb-2 rounded-full">
          <img src={'/' + pic} className="w-[40px] h-[40px] rounded-full " alt="default pic" />
          <div
            className={`absolute left-5 top-10  -translate-x-1/2 -translate-y-1/2 text-[8px] h-[8px] w-[8px] rounded-full ${statues === statue.ONLINE ? 'bg-custom-green' : statues === statue.IN_GAME ? 'bg-orange-400' : 'bg-gray-400'}`}> 
            </div>
        </div>
        <div className="text-gray-200 text-[16px] font-thin pl-1">{name}</div>
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
    </div>
  );
};

export default FriendItem;
