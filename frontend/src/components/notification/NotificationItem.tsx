'use client';
import { ContextGlobal } from '@/context/contex';
import { Notification } from '@/interfaces';
import React, { use, useContext, useEffect, useState } from 'react'
import { postReadNotification } from '@/api/notifications/notifications.api';
import { useRouter } from 'next/navigation';
import { Play, X } from 'lucide-react';
import ChallengeNotif from "../game/ChallengeNotif";

function NotificationItem({item,setOpen}: {item: Notification,setOpen: any}) {
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const { notification ,setNotification, socket, profile}: any = useContext(ContextGlobal);
    const [ isPlaying, setIsPlaying ] = useState(false);
    const router = useRouter();
    function friendRequest(item: Notification) {
        postReadNotification(item.id).then((res) => {
            if(res.data.vue === true)
                setNotification((prevNotifications: Notification[]) =>
                    prevNotifications.filter((notification: Notification) => notification !== item)
                );
        }).catch((err) => { });
        setOpen(false);
        router.push(`/dashboard/profile/` + item.senderName);
    }
    useEffect(() => {}, [notification]);
    function friendAcceptRequest(item: Notification) {
        postReadNotification(item.id).then((res) => {
            if(res.data.vue === true)
                setNotification((prevNotifications: Notification[]) =>
                    prevNotifications.filter((notification: Notification) => notification !== item)
                );
        }).catch((err) => { });
        setOpen(false);
        router.push(`/dashboard/friends`);
    }
    socket?.on('updateNotification', (data: any) => {
        if (data?.notification) {
            postReadNotification(data?.notification.id).then((res) => {
                if(res.data.vue === true)
                    setNotification((prevNotifications: Notification[]) =>
                        prevNotifications.filter((notification: Notification) => notification !== data?.notification)
                    );
            }).catch((err) => { });  
        }
    });
    function handleButtonClick() {
        switch (item.type) {
            case 'friendRequest':
                friendRequest(item);
                break;
            case 'friendAcceptRequest':
                friendAcceptRequest(item);
                break;
            default:
                break;
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
                    if (player.isPlaying && player.playerId === profile?.id) {
                        setIsPlaying(true);
                    } else if (!player.isPlaying && player.playerId === profile?.id) {
                        setIsPlaying(false);
                    }
                });
            } catch {}
        };
    
        return () => {
          eventSource.close();
        };
    
      }, [profile?.id]);

    return (
        <>
            <img src={item.senderImage} alt="" className="w-10 h-10 rounded-full" />
            
            {
                item.RequestType === 'FRIENDSHIP' ?
                <div className='flex items-center justify-between px-2 w-full'>
                    <p className="ml-2 text-white">{item?.content}</p>
                    <button className="bg-[#78196F] px-4 py-2 rounded-xl border border-white text-[14px] text-white" onClick={handleButtonClick}>Check</button>
                </div> :
                <div className='flex items-center justify-between px-2 w-full'>
                    <p className="ml-2 text-white">Your friend is challenging you</p>
                    {!isPlaying && <button className="bg-[#78196F] px-4 py-2 rounded-xl border border-white text-[14px] text-white" onClick={() => setOpenAlert(!openAlert)}>Check</button>}
                    { openAlert && <ChallengeNotif openAl={() => {
                            setOpenAlert(!openAlert);}}
                            gameId={ item.content }
                        />}
                </div>
            }
        </>
    );
}

export default NotificationItem