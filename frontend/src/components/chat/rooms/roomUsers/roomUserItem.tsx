import { ContextGlobal } from '@/context/contex';
import { ChatRoomMember } from '@/interfaces'
import React, { useContext, useState } from 'react'
import { GoShieldLock } from "react-icons/go";
import { GoShieldX } from "react-icons/go";
import { GiBootKick } from "react-icons/gi";
import { RiChatOffFill } from "react-icons/ri";
import { FaBan } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

function RoomUserItem({ chatRoomMember, profileRoomStatus, chatRoom, chatRoomRole }: { chatRoomMember: ChatRoomMember, chatRoom: any, chatRoomRole: string, profileRoomStatus: any }) {
    const { chatSocket } = useContext(ContextGlobal);
    const [OpenSelect, setOpenSelect] = useState(false);
    const [rangeValue, setRangeValue] = useState(0);

    const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setRangeValue(value);
        console.log(value);
    };
    // hendle ban user
    const handleBan = () => {
        chatSocket?.emit('ban-user', { userId: chatRoomMember.user.id, roomId: chatRoom.id });
    }
    // hendle kick user
    const handleKick = () => {
        chatSocket?.emit('kick-user', { userId: chatRoomMember.user.id, roomId: chatRoom.id });
    }
    // hendle mute user
    const handleMute = () => {
        chatSocket?.emit('mute-user', { userId: chatRoomMember.user.id, roomId: chatRoom.id });
    }
    // hendle admin and unadmin user
    const handleAdmin = () => {
        chatSocket?.emit('admin-user', { userId: chatRoomMember.user.id, roomId: chatRoom.id });
    }

    const handleUnAdmin = () => {
        chatSocket?.emit('unadmin-user', { userId: chatRoomMember.user.id, roomId: chatRoom.id });
    }


    return (
        <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-[#A1A1A1]">
                <img src={chatRoomMember.user.image ? chatRoomMember.user.image : "/images/blank.png"} alt="" className="w-full h-full rounded-full" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-lg">{chatRoomMember.user.username}</h1>
                <h1 className="text-sm text-[#A1A1A1]">
                    {chatRoomRole}
                </h1>
            </div>
            {
                profileRoomStatus.userId === chatRoom.owner && chatRoomMember.user.id !== chatRoom.owner && (
                    chatRoomMember.is_admin === false ?
                        <div>
                            <button onClick={() => { handleAdmin() }} className="bg-[#A1A1A1] rounded-full px-2 py-1">
                                <GoShieldLock />
                            </button>
                        </div> :
                        <div>
                            <button onClick={() => { handleUnAdmin() }} className="bg-[#A1A1A1] rounded-full px-2 py-1">
                                <GoShieldX />
                            </button>
                        </div>
                )
            }
            {
                profileRoomStatus.is_admin && profileRoomStatus.userId !== chatRoomMember.user.id && chatRoomMember.user.id !== chatRoom.owner && (
                    <div className=' flex items-center justify-center space-x-2'>
                        <button onClick={() => { handleKick() }} className="bg-[#A1A1A1] rounded-full px-2 py-1">
                            <GiBootKick />
                        </button>
                        <button onClick={() => { handleBan() }} className="bg-[#A1A1A1] rounded-full px-2 py-1">
                            <FaBan />
                        </button>
                        <button onClick={() => { setOpenSelect(!OpenSelect) }} className="bg-[#A1A1A1] rounded-full px-2 py-1">
                            <RiChatOffFill />
                        </button>
                        {
                            OpenSelect &&
                            <div className='flex items-center space-x-1'>
                                <input type="range"
                                    value={rangeValue}
                                    onChange={handleRangeChange}
                                    min="0" max="100" className="range bg-white h-[15px]" />
                                <button onClick={() => alert("")}>
                                    <FaCheck color='green' size={18} className='border rounded-full border-green-400' />
                                </button>
                                <button>
                                    <MdOutlineCancel color='red' size={20} className='' onClick={() => setOpenSelect(!OpenSelect)} />
                                </button>
                            </div>
                        }
                    </div>

                )
            }

        </div>
    )
}

export default RoomUserItem
