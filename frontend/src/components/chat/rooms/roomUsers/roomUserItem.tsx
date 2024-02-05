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

const secondsToTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0') + 'h'}:${String(minutes).padStart(2, '0') + 'm'}:${String(remainingSeconds).padStart(2, '0') + 's'}`;
};

const timeToSeconds = (timeString: string): number => {

    const [hours, minutes, seconds] = timeString.split(':').map(String);
    if (hours === undefined || minutes === undefined || seconds === undefined)
        return -1;
    if (hours.length === 0 || minutes.length === 0 || seconds.length === 0)
        return -1;
    const hoursInt = parseInt(hours, 10);
    const minutesInt = parseInt(minutes, 10);
    const secondsInt = parseInt(seconds, 10);
    if (isNaN(hoursInt) || isNaN(minutesInt) || isNaN(secondsInt) || hoursInt < 0 || minutesInt < 0 || secondsInt < 0 || minutesInt > 59 || secondsInt > 59) {
        return -1;
    }
    return hoursInt * 3600 + minutesInt * 60 + secondsInt;
};

function RoomUserItem({ chatRoomMember, profileRoomStatus, chatRoom, chatRoomRole }: { chatRoomMember: ChatRoomMember, chatRoom: any, chatRoomRole: string, profileRoomStatus: any }) {
    const { chatSocket } = useContext(ContextGlobal);
    const [OpenSelect, setOpenSelect] = useState(false);
    const [muteDuration, setMuteDuration] = useState(0);
    const [error, setError] = useState('');


    const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setMuteDuration(value);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const seconds = timeToSeconds(value);
        console.log(seconds);
        if (seconds === -1)
            return setError('Invalid time format');
        if (seconds > 86400)
            return setError('muted time must be less than 24 hours');
        setError('');
        setMuteDuration(seconds);
    };

    const handleConfirm = () => {
        chatSocket?.emit('mute-user', { roomId: chatRoom.id, userId: chatRoomMember.user.id, duration: muteDuration });
        setOpenSelect(!OpenSelect);
    };
    // hendle ban user
    const handleBan = () => {
        chatSocket?.emit('ban-user', { userId: chatRoomMember.user.id, roomId: chatRoom.id });
    }
    // hendle kick user
    const handleKick = () => {
        chatSocket?.emit('kick-user', { userId: chatRoomMember.user.id, roomId: chatRoom.id });
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
                        <button onClick={() => { setOpenSelect(!OpenSelect); }} className="bg-[#A1A1A1] rounded-full px-2 py-1">
                            <RiChatOffFill />
                        </button>
                        {OpenSelect && (
                            <div className='flex items-center space-x-1'>
                                <div className='group relative flex justify-center items-center'>
                                    <input
                                        type="range"
                                        value={muteDuration}
                                        onChange={handleRangeChange}
                                        min="0"
                                        max="86400" // 1 day in seconds (24 hours * 60 minutes * 60 seconds)
                                        step="1"
                                        className="range bg-white h-[15px]"
                                    />
                                    <div
                                        className={`absolute right-28 -top-20 rounded-md px-2 py-1  bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-10`}
                                    >
                                        {error && <span className='p-1 text-red-500'>{error}</span> ||
                                            <p className='p-1'>{secondsToTime(muteDuration)}</p>
                                        }
                                        <input
                                            type="text"
                                            className="bg-indigo-100 focus:ring-0 text-indigo-800 text-sm rounded-lg"
                                            placeholder='00:00:00'
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <button onClick={handleConfirm}>
                                    <FaCheck color='green' size={18} className='border rounded-full border-green-400' />
                                </button>
                                <button>
                                    <MdOutlineCancel color='red' size={20} onClick={() => setOpenSelect(!OpenSelect)} />
                                </button>
                            </div>
                        )}
                    </div>

                )
            }

        </div>
    )
}

export default RoomUserItem
