'user client'
import React, { useContext, useState, KeyboardEvent } from 'react'
import Image from 'next/image';
import { ContextGlobal } from '@/context/contex';
import { Messages, Recent } from '@/interfaces';
import EmojiPicker from './emoji/emojiPicker';

interface SendchatmsgProps {
    chatRoomId: number;
    isblocked?: boolean;
    friendId?: number;
}

const Sendchatmsg: React.FC<SendchatmsgProps> = ({ chatRoomId, isblocked, friendId }) => {
    const { profile, chatSocket } = useContext(ContextGlobal);
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
        const messageData: Messages = {
            senderId: Number(profile?.id),
            chatRoomId: chatRoomId,
            text: message,
        };
        const recentArray: Recent[] = [
            {
                chatRoomId: chatRoomId,
                userId: profile?.id,
                senderId: profile?.id,
                link: `/dashboard/chat/user/${chatRoomId}`,
                lastMessage: message,
            },
            {
                chatRoomId: chatRoomId,
                userId: friendId,
                senderId: profile?.id,
                link: `/dashboard/chat/user/${chatRoomId}`,
                lastMessage: message,
            }
        ];
        chatSocket?.emit('add-recent', recentArray);
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
            {
                !isblocked &&
                <div className={`flex justify-center items-center space-x-2 my-3`}>
                    {/* <div className="bg-gray-300 w-[6%] h-10 rounded-3xl flex justify-center items-center space-x-4">
                    </div> */}
                    <div className=" bg-gray-300 text-black flex justify-center items-center w-[30%] h-10 rounded-3xl font-light">
                        <EmojiPicker setMessage={setMessage} />
                        <input
                            type="text"
                            name='message'
                            placeholder="Please Be nice in the chat"
                            className="w-4/5 h-full border-none focus:ring-0 bg-transparent"
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            onKeyDown={(e) => handleKeyDown(e)}
                        />
                        <button onClick={() => { addMsg() }}>
                            <Image
                                src="/send-1.svg"
                                alt="send"
                                width={30}
                                height={30}
                                className="cursor-pointer"
                                priority={true}
                                draggable={false}
                            />
                        </button>
                    </div>
                </div>
            }
        </>
    );
};

export default Sendchatmsg;
