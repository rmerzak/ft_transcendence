'use client'
import React, { useContext, useEffect, useState } from 'react';
import { Friendship, ChatRoom, RoomVisibility } from '@/interfaces';
import { ContextGlobal } from '@/context/contex';
import Image from 'next/image';
import { makeConversation } from '@/api/chat/chat.api';
import { useRouter } from 'next/navigation';

const UserItem = ({ friend }: { friend: Friendship }) => {
  const { profile, chatSocket } = useContext(ContextGlobal);
  const [status, setStatus] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (profile && friend) {
      profile?.id === friend.sender.id ? setStatus(friend.receiver.status) : setStatus(friend.sender.status);
    }
    const eventSource = new EventSource(`${process.env.API_BASE_URL}/api/is-playing`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        parsedData.forEach((player: { playerId: number, isPlaying: boolean }) => {
          if (player.isPlaying && player.playerId === (profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id)) {
            setIsPlaying(true);
          } else if (!player.isPlaying && player.playerId === (profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id)) {
            setIsPlaying(false);
          }
        });
      } catch { }
    };
    return () => {
      eventSource.close();
    };
  }, [friend.id, profile]);

  function makeMessage() {
    const chatRoomData: ChatRoom = {
      visibility: RoomVisibility.PRIVATE,
      passwordHash: '',
      name: profile?.id + '_' + (profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id),
    };
    makeConversation((profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id), chatRoomData).then((res) => {
      chatSocket?.emit('join-room', res.data.id);
      router.push(`/dashboard/chat/user/${res.data.id}`);
    }).catch((err) => {

    });
  }
  return (
    (friend.status === 'ACCEPTED' && !friend.block && (status === 'ONLINE' || status === 'INGAME')) ? (
      <div onClick={makeMessage} className=' w-full'>
        <div className='relative w-[45px] h-[45px] md:w-[50px] md:h-[50px] mx-auto'>
          <Image
            src={profile?.id === friend.sender.id ? friend.receiver.image : friend.sender.image}
            alt={profile?.id === friend.sender.id ? friend.receiver.username : friend.sender.username}
            width={60}
            height={60}
            draggable={false}
            priority={true}
            className="h-[45px] w-[45px] md:h-[50px] md:w-[50px] rounded-full mx-auto hover:cursor-pointer "
          />
          <span className={`w-2 h-2 md:w-3 md:h-3 top-9  left-7 md:top-10 rounded-full absolute ${(status === 'INGAME' || isPlaying) ? 'bg-orange-400' : status === 'ONLINE' ? 'bg-custom-green' : 'bg-gray-400'}`}></span>
          <p className={`text-white text-center text-xs md:text-sm`}>
            {profile?.id === friend.sender.id ? friend.receiver.username : friend.sender.username}
          </p>
        </div>
      </div>
    ) : null
  );
};

export default UserItem;
