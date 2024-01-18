'use client'
import React, { useContext, useEffect, useState } from 'react';
import { Friendship, ChatRoom, RoomVisibility } from '@/interfaces';
import { ContextGlobal } from '@/context/contex';
import Image from 'next/image';
import { makeConversation } from '@/api/chat/chat.api';
import { useRouter } from 'next/navigation';

const UserItem = ({ friend } : { friend: Friendship }) => {
  const { profile }:any = useContext(ContextGlobal);
  const [status, setStatus] = useState<string>('');
  const router = useRouter();
  useEffect(() => {
    if (profile?.id === friend.sender.id) {
      setStatus(friend.receiver.status);
    } else {
      setStatus(friend.sender.status);
    }
    // console.log('status: ', status);
  }, [status, friend]);

  function makeMessage() {
    const chatRoomData: ChatRoom = {
      visibility: RoomVisibility.PRIVATE,
      passwordHash: '',
      name: profile.id + '_' + (profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id),
    };
    makeConversation((profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id), chatRoomData).then((res) => {
      router.push(`/dashboard/chat/user/${res.data.id}`);
    }).catch((err) => {
      console.log(err);
    });
  }
  return (
    (friend.status === 'ACCEPTED' && !friend.block && (status === 'ONLINE' || status === 'IN_GAME')) ? (
        <div onClick={makeMessage}>
        <Image
          src={profile?.id === friend.sender.id ? friend.receiver.image : friend.sender.image }
          alt={profile?.id === friend.sender.id ? friend.receiver.username : friend.sender.username }
          width={60}
          height={60}
          priority={true}
          className="h-[45px] w-[45px] md:h-[60px] md:w-[60px] rounded-full mx-auto hover:cursor-pointer"
        />
        <span className={`w-2 md:w-3 h-2 md:h-3 left-10 top-9 md:left-[82px] md:top-12 rounded-full absolute ${status === 'ONLINE' ? 'bg-custom-green' : status === 'IN_GAME' ? 'bg-orange-400' : 'bg-gray-400'}`}></span>
        <p className={`text-white text-center text-xs md:text-base`}>
        {profile?.id === friend.sender.id ? friend.receiver.username : friend.sender.username }
        </p>
      </div>
    ) : null
  );
};

export default UserItem;
