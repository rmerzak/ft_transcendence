'user client';

import { ContextGlobal } from "@/context/contex";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

interface ChatheaderProps {
    username?: string;
    status?: string;
    userId?: number;
    friendBlock?: boolean | undefined;
    blockByMe?: number | undefined;
}

const Chatheader: React.FC<ChatheaderProps> = ({ username, status, userId, friendBlock, blockByMe }) => {
    const { profile, socket } = useContext(ContextGlobal);

    const handleUnblock = () => {
        socket?.emit('unblockFriend', userId);
    }
    const handleBlock = () => {
        socket?.emit('blockFriend', userId);
    }
    
    return (
        <>
            <div>
                <div className="flex">
                    {status ?
                        <div className="w-full flex justify-center items-center space-x-2">
                            <span className={`${friendBlock ? 'hidden' : '' || status === 'ONLINE' ? 'bg-custom-green' : status === 'IN_GAME' ? 'bg-orange-400' : 'bg-gray-400'} rounded-full h-3 w-3`}></span>
                            <h1 className="text-xl font-thin">{username}</h1>
                        </div> : <div className="w-full flex justify-center items-center space-x-2"></div>
                    }
                    <div className="">
                        <div className="dropdown dropdown-left">
                            <button tabIndex={0}>
                                <MoreVertical />
                            </button>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-purplee rounded-box w-52">
                                <li><Link href={`/dashboard/profile/${username}`}>View profile</Link></li>
                                <li className={`${ blockByMe === undefined || (blockByMe !== profile?.id && friendBlock) ? 'hidden' : ''}`}>
                                    <div onClick={friendBlock ? handleUnblock : handleBlock} className={`flex items-center space-x-2 cursor-pointer `}>
                                        {friendBlock ? 'Unblock ' : 'Block '}{username}
                                    </div>
                                </li>
                                {/* mol game need to work here */}
                                <li>
                                    <div onClick={()=>{console.log('inaho fa5')}}>
                                        Invite to game
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

export default Chatheader;