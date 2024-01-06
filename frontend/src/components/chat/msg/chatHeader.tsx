'user client';
import { getChatRoomMembers } from '@/api/chat/chat.api';
import { ContextGlobal } from '@/context/contex';
import { ChatRoomUsers } from '@/interfaces';
import React, { useContext, useEffect, useState } from 'react';

interface ChatheaderProps {
    // chatRoomMembers?: ChatRoomUsers[];
    chatId?: number;
}

const Chatheader: React.FC<ChatheaderProps> = ({ chatId }) => {
    const { profile }: any = useContext(ContextGlobal);
    const [username, setUsername] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [chatRoomMembers, setChatRoomMembers] = useState<ChatRoomUsers[]>([]);

    useEffect(() => {
        if (chatId) {
            getChatRoomMembers(chatId).then((res) => {
                setChatRoomMembers(res.data);
            }).catch((err) => {
               console.log(err);
            });
        }
    }, [chatId]);
    
    useEffect(() => {
        const targetMessage = chatRoomMembers.find((member) => member.user.id !== profile?.id);
    
        if (targetMessage) {
            setUsername(targetMessage.user.username);
            setStatus(targetMessage.user.status);
        }
    }, [chatRoomMembers, profile]);

    return (
        <>
            <div>
                <div className="flex">
                    {status ?
                        <div className="w-full flex justify-center items-center space-x-2">
                            <span className={`${status === 'ONLINE' ? 'bg-custom-green' : status === 'IN_GAME' ? 'bg-orange-400' : 'bg-gray-400'} rounded-full h-3 w-3`}></span>
                            <h1 className="text-xl font-thin">{username}</h1>
                        </div>: <div className="w-full flex justify-center items-center space-x-2"></div>
                    }
                    <div className="">
                        {/* image messages parrametres */}
                        <button>
                            <svg
                                className="h-8 w-8"
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M16 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zM6 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zM26 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"
                                    fill="#ffffff"
                                    className=""
                                ></path>
                            </svg>
                        </button>
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