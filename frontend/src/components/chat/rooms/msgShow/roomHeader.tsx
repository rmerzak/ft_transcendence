'user client';

import User from "@/components/game/User";
import { ContextGlobal } from "@/context/contex";
import { ChatRoom, ChatRoomMember } from "@/interfaces";
import { User2Icon } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import  ChannelSettingPopup  from "../ChannelSettingPopup";

interface roomHeaderProps {
    chatRoom?: ChatRoom;
}

const RoomHeader: React.FC<roomHeaderProps> = ({ chatRoom }) => {
    const [isPopupVisible, setPopupVisible] = useState(false);

  const handleSettingClick = () => {
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };


    const openChannelSettingPopup = () => {
        ChannelSettingPopup;
      };
    return (
        <>
            <div>
                <div className="flex">
                    {
                        <div className="w-full flex justify-center items-center space-x-2">
                            {/* <span className={`${status === 'ONLINE' ? 'bg-custom-green' : status === 'IN_GAME' ? 'bg-orange-400' : 'bg-gray-400'} rounded-full h-3 w-3`}></span> */}
                            <h1 className="text-xl font-thin">#{chatRoom?.name}</h1>
                        </div>
                        // : <div className="w-full flex justify-center items-center space-x-2"></div>
                    }
                    <div className=" flex">
                        <User2Icon />
                        <div className="dropdown dropdown-left">
                            <svg
                                role="button"
                                className="h-8 w-8 m-1"
                                viewBox="0 0 32 32"
                                tabIndex={0}
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M16 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zM6 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zM26 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"
                                    fill="#ffffff"
                                    className=""
                                ></path>
                            </svg>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-purplee rounded-box w-52">
                                <li>
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                        Leave
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                        <button onClick={handleSettingClick}>Setting</button>
                                    </div>
                                    {isPopupVisible && (
                                        <ChannelSettingPopup onClose={handleClosePopup} />
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <hr className="w-1/5" />
                </div>
            </div>
        </>
    );
};

export default RoomHeader;
