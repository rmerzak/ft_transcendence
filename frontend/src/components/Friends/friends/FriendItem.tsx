// FriendItem.js
'use client'
import React, { useContext, useEffect, useState } from 'react';
import { MessagesSquare, Gamepad2, XOctagon, UserMinus } from 'lucide-react';
import { Friendship } from '@/interfaces';
import { ContextGlobal } from '@/context/contex';
import ChallengeAlert from '@/components/game/ChallengeAlert';
import { makeConversation } from '@/api/chat/chat.api';
import { ChatRoom, RoomVisibility } from '@/interfaces';
import { useRouter } from 'next/navigation';

const FriendItem = ({ friend }: { friend: Friendship }) => {
  const { profile, socket, chatSocket }: any = useContext(ContextGlobal);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const router = useRouter();
  const handleFriend = (status: boolean) => {
    if (status) {

      socket?.emit('removeFriend', profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id);
      //getFriends(profile?.id);
    }
    else {
      socket?.emit('blockFriend', profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id);
      // setFriends((prev:any) => prev.filter((item:any) => item.senderId !== friend.senderId));
    }
  }
  
  function makeMessage() {
    const chatRoomData: ChatRoom = {
      visibility: RoomVisibility.PRIVATE,
      passwordHash: '',
      name: profile?.id + '_' + (profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id),
    };
    makeConversation((profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id), chatRoomData).then((res) => {
      chatSocket?.emit('join-room', res?.data?.id);
      router.push(`/dashboard/chat/user/${res?.data?.id}`);
    }).catch((err) => {
      
    });
  }

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.API_BASE_URL}/api/is-playing`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        parsedData.forEach((player: { playerId: number, isPlaying: boolean }) => {
          if (player.isPlaying && player.playerId === profile.id) {
            setIsPlay(true);
          } else if (!player.isPlaying && player.playerId === profile.id) {
            setIsPlay(false);
          }
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

  }, [profile.id]);
  return (
    (friend.status === 'ACCEPTED') ? (
      <div className={`text-white bg-achievements1 flex items-center justify-between py-1 mx-3`}>
        <div className="flex items-center">
          <div className="relative w-[30px] h-[30px] md:w-[40px] md:h-[40px] ml-2 mb-2 rounded-full">
            <img src={profile?.id === friend.sender.id ? friend.receiver.image : friend.sender.image} className="w-[40px] h-[40px] rounded-full " alt="default pic" />
          </div>
          <div className="text-gray-200 text-[16px] font-thin pl-1">{profile?.id === friend.sender.id ? friend.receiver.username : friend.sender.username}</div>
        </div>
        <div className="">
          <button className="md:px-2 px-1" onClick={makeMessage}>
            <MessagesSquare />
          </button>
          {
            !isPlaying && !isPlay &&
            <button className="md:px-2 px-1">
              <Gamepad2 onClick={() => setOpenAlert(!openAlert)} />
            </button>
          } {
            openAlert && <ChallengeAlert openAl={() => { setOpenAlert(!openAlert); }} playerId={profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id} />
          }
          <button className="md:px-2 px-1">
            <XOctagon onClick={() => handleFriend(false)} />
          </button>
          <button className="md:px-2 px-1">
            <UserMinus onClick={() => handleFriend(true)} />
          </button>
        </div>
      </div>) : null
  );
};

export default FriendItem;
