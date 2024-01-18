'user client';

import { ContextGlobal } from "@/context/contex";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

interface ChatheaderProps {
    username?: string;
    status?: string;
    userId?: number;
    friendBlock?: boolean | undefined;
}

const Chatheader: React.FC<ChatheaderProps> = ({ username, status, userId, friendBlock }) => {
    const { socket } = useContext(ContextGlobal);
    const [isblock, setIsblock] = useState<boolean>(false);
    const handleUblock = () => {
        socket?.emit('unblockFriend', userId);
        setIsblock(false);
    }
    const handleBlock = () => {
            socket?.emit('blockFriend', userId);
            setIsblock(true);
            //setFriends((prev:any) => prev.filter((item:any) => item.senderId !== friend.senderId));
    }
    useEffect(() => {
        if (friendBlock !== undefined)
            setIsblock(friendBlock);
    }, [friendBlock]);
    return (
        <>
            <div>
                <div className="flex">
                    {status ?
                        <div className="w-full flex justify-center items-center space-x-2">
                            <span className={`${status === 'ONLINE' ? 'bg-custom-green' : status === 'IN_GAME' ? 'bg-orange-400' : 'bg-gray-400'} rounded-full h-3 w-3`}></span>
                            <h1 className="text-xl font-thin">{username}</h1>
                        </div> : <div className="w-full flex justify-center items-center space-x-2"></div>
                    }
                    <div className="">
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
                                <li><Link href={`/dashboard/profile/${username}`}>View profile</Link></li>
                                {/* block icon */}
                                <li>
                                    <div onClick={isblock ? handleUblock : handleBlock} className="flex items-center space-x-2 cursor-pointer">
                                        {/* <XOctagon /> */}
                                        {(isblock ? 'Unblock' : 'Block') + ' ' + username}
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