'user client'
import React, { useContext, useState, KeyboardEvent, ChangeEvent, use, useEffect } from 'react'
import Image from 'next/image';
import { ContextGlobal } from '@/context/contex';
import { Messages, Recent } from '@/interfaces';
import EmojiPicker from './emoji/emojiPicker';
import { SendHorizontal } from 'lucide-react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { SmilePlus } from 'lucide-react';

interface SendchatmsgProps {
    chatRoomId: number;
    isblocked?: boolean;
    friendId?: number | undefined;
}
// we can check if friendId is undefined or not
// if it is undefined then we not show the input field
const Sendchatmsg: React.FC<SendchatmsgProps> = ({ chatRoomId, isblocked, friendId }) => {
    const { profile, chatSocket } = useContext(ContextGlobal);
    const [message, setMessage] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addMsg();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value.replace(/(.{40}|\p{Emoji})/gu, "$1\n");
        setMessage(newValue);
    };


    const showEmogieTable = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    function addMsg() {
        chatSocket?.emit('join-room', { roomId: chatRoomId });
        if (!message || message.length === 0) return;
        const messageData: Messages = {
            type: 'NORMAL',
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
        const data = {
            msgData: messageData,
            recentData: recentArray,
        };
        chatSocket?.emit('send-message', data);
        setMessage('');
    }
    return (
        <>
            {/* end message here */}
            <div className="flex justify-center">
                <hr className="w-1/6" />
            </div>
            {/* input for send derict messages pointer-events-none opacity-50 */}
            {
                friendId !== undefined &&
                !isblocked &&
                <div className={` flex justify-center items-center space-x-2 my-3`}>
                    <div className=" bg-gray-300 text-black flex justify-center items-center w-[60%] h-10 rounded-3xl font-light">
                        <div className='relative flex ml-1'>
                            <button onClick={showEmogieTable}>
                                <SmilePlus size={24} strokeWidth={2} />
                            </button>
                            {showEmojiPicker && (<div className='absolute bottom-[100%] left-0 '>
                                <Picker theme="dark" data={data} onEmojiSelect={(emoji: { native: string; }) => setMessage((prev: string) => prev + emoji.native)} />
                            </div>
                            )}
                        </div>
                        <input
                            type="text"
                            name='message'
                            id='message'
                            placeholder="Please Be nice in the chat"
                            className="w-full h-full border-none focus:ring-0 bg-transparent"
                            onChange={(e) => handleInputChange(e)}
                            value={message}
                            onKeyDown={(e) => handleKeyDown(e)}
                        />
                        <button onClick={() => { addMsg() }} className="cursor-pointer mr-1" draggable={false} >
                            <SendHorizontal size={22} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            }
        </>
    );
};

export default Sendchatmsg;
