'user client';

import User from "@/components/game/User";
import { ContextGlobal } from "@/context/contex";
import { ChatRoom, ChatRoomMember } from "@/interfaces";
import { useContext, useState } from "react";
import ChannelSettingPopup from "../ChannelSettingPopup";
import { FaUserFriends } from "react-icons/fa";
import RoomUsers from "../roomUsers/roomUsers";
interface roomHeaderProps {
    chatRoom?: ChatRoom;
}

const RoomHeader: React.FC<roomHeaderProps> = ({ chatRoom }) => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [openUserList, setOpenUserList] = useState(false);
    const { profile } = useContext(ContextGlobal);
    const handleSettingClick = () => {
        setPopupVisible(!isPopupVisible);
    };

    function handleUserListClick() {
        setOpenUserList(!openUserList);
    }

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
                    <div className=" flex items-center">
                        <button onClick={handleUserListClick}>
                            <FaUserFriends className="w-[30px] h-[30px]" />
                        </button>
                        {
                            openUserList && (
                                <RoomUsers handleUserListClick={handleUserListClick} chatRoom={chatRoom}/>
                            )
                        }
                        {
                            isPopupVisible && (
                                <ChannelSettingPopup handleSettingClick={handleSettingClick} chatRoom={chatRoom} />
                            )
                        }
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
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-purplee rounded-box w-40">
                                <li>
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                        Leave
                                    </div>
                                </li>
                                <li className= {profile?.id === chatRoom?.owner ? `block` : `hidden`}>
                                    <div className="flex items-center space-x-2 cursor-pointer " onClick={handleSettingClick}>
                                        Setting
                                    </div>
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
