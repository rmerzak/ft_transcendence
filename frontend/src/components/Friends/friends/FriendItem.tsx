// FriendItem.js
'use client'
import React, { useContext, useEffect, useState } from 'react';
import { MessagesSquare, Gamepad2, XOctagon, UserMinus } from 'lucide-react';
import { Friendship } from '@/interfaces';
import { ContextGlobal } from '@/context/contex';
import ChallengeAlert from '@/components/game/ChallengeAlert';


const FriendItem = ({ friend } : { friend: Friendship }) => {
  const {  profile, socket  } : any = useContext(ContextGlobal);
  const [status, setStatus] = useState<string>();
  const [ openAlert, setOpenAlert ] = useState<boolean>(false);
  const [ isPlaying, setIsPlaying ] = useState(false);
  const handleFriend = (status:boolean) => {
    if(status){
      
        socket?.emit('removeFriend', profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id);
        //getFriends(profile?.id);
    } 
    else {
        socket?.emit('blockFriend', profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id);
        // setFriends((prev:any) => prev.filter((item:any) => item.senderId !== friend.senderId));
    }
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
                    setIsPlaying(true);
                } else if (!player.isPlaying && player.playerId === profile.id) {
                    setIsPlaying(false);
                }
            });
        } catch {}
    };

    return () => {
      eventSource.close();
    };

  }, [profile.id]);


  useEffect(() => {
    if (profile?.id === friend.sender.id) {
      setStatus(friend.receiver.status);
    } else {
      setStatus(friend.sender.status);
    }
  }, []);
  return (
    (friend.status === 'ACCEPTED') ? (
    <div className={`text-white bg-achievements1 flex items-center justify-between py-1 mx-3`}>
      <div className="flex items-center">
        <div className="relative w-[35px] h-[35px] md:w-[40px] md:h-[40px] ml-2 md:mb-2 rounded-full">
          <img src={profile?.id === friend.sender.id ? friend.receiver.image : friend.sender.image } className="md:w-[40px] md:h-[40px] h-[35px] w-[35px] rounded-full " alt="default pic" />
          <div
            className={`absolute left-5 md:top-10 top-8 -translate-x-1/2 -translate-y-1/2 text-[8px] h-[8px] w-[8px] rounded-full ${status === 'ONLINE' ? 'bg-custom-green' : status === 'INGAME' ? 'bg-orange-400' : 'bg-gray-400'}`}> 
            </div>
        </div>
        <div className="text-gray-200 text-[16px] font-thin pl-1">{profile?.id === friend.sender.id ? friend.receiver.username : friend.sender.username}</div>
      </div>
      <div className="">
        <button className="md:px-2 px-1">
          <MessagesSquare />
        </button>
        {
          !isPlaying &&
        <button  className="md:px-2 px-1">
          <Gamepad2 onClick={()=> setOpenAlert(!openAlert)}/>
        </button>
        } {
          openAlert && <ChallengeAlert openAl={() => {setOpenAlert(!openAlert);}} playerId={profile?.id === friend.sender.id ? friend.receiver.id : friend.sender.id} />
        }
        <button className="md:px-2 px-1">
          <XOctagon  onClick={()=> handleFriend(false)} />
        </button>
        <button className="md:px-2 px-1">
          <UserMinus onClick={()=> handleFriend(true)} />
        </button>
      </div>
    </div>) : null
  );
};

export default FriendItem;
