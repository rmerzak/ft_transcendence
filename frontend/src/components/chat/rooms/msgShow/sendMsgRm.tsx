'user client'
import React, { useContext, useState, KeyboardEvent, useEffect, use } from 'react'
import { ContextGlobal } from '@/context/contex';
import { ChatRoomMember, Messages, Recent } from '@/interfaces';
import Picker from '@emoji-mart/react'
import { SendHorizontal, SmilePlus } from 'lucide-react';
import data from '@emoji-mart/data'
import { get } from 'http';
import { getChatRoomMemberByRoomId, getChatRoomMembers } from '@/api/chat/chat.api';

interface SendchatmsgProps {
    chatRoomId: number;
}

const SendMsgRm: React.FC<SendchatmsgProps> = ({ chatRoomId }) => {
    const { profile, chatSocket } = useContext(ContextGlobal);
    const [message, setMessage] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [chatRoomMember, setChatRoomMember] = useState<ChatRoomMember>();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value.replace(/(.{40}|\p{Emoji})/gu, "$1\n");
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
            type: 'NORMAL',
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
    useEffect(() => {
        if (chatRoomId) {
            const fetch = async () => {
                getChatRoomMemberByRoomId(chatRoomId).then((res) => {
                    if (res.data) {
                        setChatRoomMember(res.data);
                    }
                }).catch((err) => {
                    
                });
            }
            fetch();
        }
    }, [chatRoomId]);

    useEffect(() => {
        if (chatRoomMember && profile?.id && chatSocket) {
            if (chatRoomMember && chatRoomMember.status === 'MUTED') {
                setIsMuted(true);
            }
            chatSocket.on('mute_apdate_sendMsgInput', (data: ChatRoomMember) => {

                if (data.userId === profile?.id && data.chatRoomId === chatRoomId) {
                    data.status === 'MUTED' ? setIsMuted(true) : setIsMuted(false);
                }
            });

        }
        return () => {
            chatSocket?.off('muted');
            chatSocket?.off('mute_apdate_sendMsgInput');
        }
    }, [chatRoomMember, profile?.id, chatSocket]);

    return (
        <>
            {/* end message here */}
            <div className="flex justify-center">
                <hr className="w-1/6" />
            </div>
            {/* input for send derict messages pointer-events-none opacity-50 */}
            {
                isMuted === false &&
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
