'user client'
import React, { useContext, useState, KeyboardEvent, ChangeEvent } from 'react'
import Image from 'next/image';
import { ContextGlobal } from '@/context/contex';
import { Messages, Recent } from '@/interfaces';
import Picker from '@emoji-mart/react'
import { SendHorizontal, SmilePlus } from 'lucide-react';
import data from '@emoji-mart/data'

interface SendchatmsgProps {
    chatRoomId: number;
    isblocked?: boolean;
    friendId?: number;
}

const SendMsgRm: React.FC<SendchatmsgProps> = ({ chatRoomId, isblocked, friendId }) => {
    const { profile, chatSocket } = useContext(ContextGlobal);
    const [message, setMessage] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value.replace(/(.{10})/g, "$1\n");
        setMessage(newValue);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            setMessage((prev: string) => prev + '\n');
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            addMsg();
        }
    };

    const showEmogieTable = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    function addMsg() {
        if (!message || message.length === 0) return;
        const messageData: Messages = {
            senderId: Number(profile?.id),
            chatRoomId: chatRoomId,
            text: message,
        };

        chatSocket?.emit('send-message', { msgData: messageData });
        let isError = new Promise((resolve) => {
            chatSocket?.on('error', (err: string) => {
                if (err !== '')
                    resolve(true);
                resolve(false);
            });
        });

        isError.then((result) => {
            if (!result)
                chatSocket?.emit('join-room', { roomId: chatRoomId });
        });
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
                !isblocked &&
                <div className={` flex justify-center items-center space-x-2 my-3`}>
                    <div className=" bg-gray-300 text-black flex justify-center items-center w-[30%] h-10 rounded-3xl font-light">
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

export default SendMsgRm;
