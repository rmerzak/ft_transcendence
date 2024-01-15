'user client'
import React, { useContext, useEffect, useState, KeyboardEvent, use } from 'react'
import Image from 'next/image';
import { ContextGlobal } from '@/context/contex';
import { Messages } from '@/interfaces';

interface SendchatmsgProps {
    chatRoomId: number;
    isblocked?: boolean;
}

const Sendchatmsg: React.FC<SendchatmsgProps> = ({ chatRoomId, isblocked }) => {
    const {  profile,  chatSocket } = useContext(ContextGlobal);
    const [message, setMessage] = useState<string>('');

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault(); 
            addMsg();
        }
      };

    function addMsg() {
        chatSocket?.emit('join-room', { roomId: chatRoomId });
        if (!message || message.length === 0) return;    
        const messageData:Messages = {
            senderId: Number(profile?.id),
            chatRoomId: chatRoomId,
            text: message,
        };
        const RecentData = {
            chatRoomId: chatRoomId,
            userId: Number(profile?.id),
            link: `/dashboard/chat/user/${chatRoomId}`,
            lastMessage: message,
        };
        chatSocket?.emit('add-recent', RecentData);
        chatSocket?.emit('send-message', messageData);
        setMessage('');
    }
    
    return (
        <>
            {/* end message here */}
            <div className="flex justify-center">
                <hr className="w-1/5" />
            </div>
            {/* input for send derict messages pointer-events-none opacity-50 */}
            <div className={`flex justify-center items-center space-x-2 my-3 ${isblocked ? 'hidden' : ''}`}>
                <div className="bg-gray-300 w-[6%] h-10 rounded-3xl flex justify-center items-center space-x-4">
                    <Image
                        src="/folder.svg"
                        alt="attach"
                        width={20}
                        height={20}
                        draggable={false}
                        className="cursor-pointer"
                    />
                    <Image
                        src="/emoji.svg"
                        alt="emoji"
                        width={20}
                        height={20}
                        draggable={false}
                        className="cursor-pointer h-5 w-5"
                    />
                </div>
                <div className=" bg-gray-300 text-black flex justify-center items-center w-[30%] space-x-2 h-10 rounded-3xl font-light">
                    <input
                        type="text"
                        placeholder="Please Be nice in the chat"
                        className="w-4/5 h-full bg-transparent border-none focus:ring-0"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <button onClick={()=>{addMsg()}}>
                        <Image
                            src="/send-1.svg"
                            alt="send"
                            width={30}
                            height={30}
                            className="cursor-pointer"
                            draggable={false}
                        />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sendchatmsg;