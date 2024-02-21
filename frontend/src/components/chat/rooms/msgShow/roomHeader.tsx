'user client';
import { ContextGlobal } from "@/context/contex";
import { ChatRoom, ChatRoomMember } from "@/interfaces";
import { useContext, useState } from "react";
import ChannelSettingPopup from "../ChannelSettingPopup";
import { FaUserFriends } from "react-icons/fa";
import RoomUsers from "../roomUsers/roomUsers";
import LeavePopup from "../LeavePopup";
import { MoreVertical } from "lucide-react";
interface roomHeaderProps {
    chatRoom?: ChatRoom;
}

const RoomHeader: React.FC<roomHeaderProps> = ({ chatRoom}) => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [openUserList, setOpenUserList] = useState(false);
    const [leave, setLeave] = useState(false);
    const { profile } = useContext(ContextGlobal);
    
    const handleSettingClick = () => {
        setPopupVisible(!isPopupVisible);
    };

    const handleLeaveClick = () => {
        setLeave(!leave);
    }

    function handleUserListClick() {
        setOpenUserList(!openUserList);
    }

    return (
        <>
            <div>
                <div className="flex">
                    {
                        <div className="w-full flex justify-center items-center space-x-2">
                            <h1 className="text-xl font-thin">#{chatRoom?.name}</h1>
                        </div>
                    }
                    <div className=" flex items-center">
                        <button onClick={handleUserListClick}>
                            <FaUserFriends className="w-[30px] h-[30px]" />
                        </button>
                        {
                            openUserList && (
                                <RoomUsers handleUserListClick={handleUserListClick} chatRoomId={chatRoom?.id}/>
                            )
                        }
                        {
                            isPopupVisible && (
                                <ChannelSettingPopup handleSettingClick={handleSettingClick} chatRoom={chatRoom} />
                            )
                        }
                        {
                            leave && (
                                <LeavePopup handleLeaveClick={handleLeaveClick} chatRoom={chatRoom}/>
                            )
                        }
                        <div className="dropdown dropdown-left">
                            <button tabIndex={0}>
                                <MoreVertical />
                            </button>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-purplee rounded-box w-40">
                                <li>
                                    <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLeaveClick}>
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
                    <hr className="w-1/4"/>
                </div>
            </div>
        </>
    );
};

export default RoomHeader;
