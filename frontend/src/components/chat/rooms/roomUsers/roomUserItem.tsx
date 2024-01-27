import { ContextGlobal } from '@/context/contex';
import { ChatRoomMember } from '@/interfaces'
import React, { use, useContext, useState } from 'react'
import { GoShieldLock } from "react-icons/go";
import { GoShieldX } from "react-icons/go";
import { GiBootKick } from "react-icons/gi";
import { RiChatOffFill } from "react-icons/ri";
import { FaBan } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

function RoomUserItem({ chatRoomMember, profileRoomStatus, chatRoom, chatRoomRole }: { chatRoomMember: ChatRoomMember, chatRoom: any, chatRoomRole: string, profileRoomStatus: any }) {
    const [OpenSelect, setOpenSelect] = useState(false);
    const [rangeValue, setRangeValue] = useState(0);

    const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setRangeValue(value);
        console.log(value);
    };
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
                            <button className="bg-[#A1A1A1] rounded-full px-2 py-1">
                                <GoShieldLock />
                            </button>
                        </div> :
                        <div>
                            <button className="bg-[#A1A1A1] rounded-full px-2 py-1">
                                <GoShieldX />
                            </button>
                        </div>
                )
            }
            {
                profileRoomStatus.is_admin && profileRoomStatus.userId !== chatRoomMember.user.id && chatRoomMember.user.id !== chatRoom.owner && (
                    <div className=' flex items-center justify-center space-x-2'>
                        <button className="bg-[#A1A1A1] rounded-full px-2 py-1">
                            <GiBootKick />
                        </button>
                        <button className="bg-[#A1A1A1] rounded-full px-2 py-1">
                            <FaBan />
                        </button>
                        <button onClick={() => setOpenSelect(!OpenSelect)} className="bg-[#A1A1A1] rounded-full px-2 py-1">
                            <RiChatOffFill />
                        </button>
                        {
                            OpenSelect &&
                            <div className='flex items-center space-x-1'>
                                <input type="range"
                                    value={rangeValue}
                                    onChange={handleRangeChange}
                                    min="0" max="100" className="range bg-white h-[15px]" />
                                <button>
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
