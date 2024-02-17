'use client'
import React, { useEffect, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler';
import JoinChannel from './JoinChannel';
import { MdAddLink, MdOutlineKey } from 'react-icons/md';
import { ChatRoom, ChatRoomMember } from '@/interfaces';
import { RiChatNewFill } from "react-icons/ri";
import { getChatRoomMembershipStatus } from '@/api/chat/chat.api';

interface ChannelItemProps {
    channel: ChatRoom;
    HandleOpen(): void;
    handleDisplayChannels(): void;
}

function ChannelItem({ channel, HandleOpen, handleDisplayChannels }: ChannelItemProps) {
    const [openChannel, setOpenChannel] = useState<ChatRoom | null>(null);
    const [Membership, setMembership] = useState<ChatRoomMember>();

  function Handlepopup() {
    HandleOpen();
    setOpenChannel(null);
  }

    const handleClick = (ChatRoom: ChatRoom) => {
        setOpenChannel(ChatRoom);        
    };
    useEffect(() => {
        getChatRoomMembershipStatus(channel.id).then((res) => {
            console.log(res.data);
            if (res.data)
                setMembership(res.data);
        })
    }, [])

    return (
        <div className="flex border md:w-[160px] w-[200px] bg-[#811B77]/50 justify-between items-center text-xs md:text-base p-3 my-[6px] md:my-[10px] mx-2 rounded-md text-white hover:bg-[#811B77]/100">
            #{channel.name}
            <button onClick={() => handleClick(channel)}>
                {!Membership?.chatRoomId && (
                    <>
                        {channel.visibility === "PRIVATE" && <RiChatNewFill className="w-[22px] h-[22px]" />}
                        {channel.visibility === "PUBLIC" && <MdAddLink className="w-[22px] h-[22px]"/>}
                        {channel.visibility === "PROTECTED" && <MdOutlineKey className="w-[22px] h-[22px]" />}
                    </>
                )}
            </button>
            {openChannel === channel  && (
                
                <JoinChannel
                    channel={channel}
                    setOpenChannel={setOpenChannel}
                    Handlepopup={Handlepopup}
                    handleDisplayChannels={handleDisplayChannels}
                />                  
            )}
        </div>
    );
};

export default ChannelItem
