import { ContextGlobal } from '@/context/contex';
import { Notification } from '@/interfaces';
import React, { useContext } from 'react'
import { postReadNotification } from '@/api/notifications/notifications.api';
import { useRouter } from 'next/navigation';
import { Play, X } from 'lucide-react';
import ChallengeAlert from '../game/ChallengeAlert';

function NotificationItem({item,setOpen}: {item: Notification,setOpen: any}) {
    const { notification ,setNotification}: any = useContext(ContextGlobal);
    const router = useRouter();
    function friendRequest(item: Notification) {
        postReadNotification(item.id).then((res) => {
            if(res.data.vue === true)
                setNotification((prevNotifications: Notification[]) =>
                    prevNotifications.filter((notification: Notification) => notification !== item)
                );
        }).catch((err) => { console.log(err)});
        setOpen(false);
        router.push(`/dashboard/profile/` + item.senderName);
    }
    function friendAcceptRequest(item: Notification) {
        postReadNotification(item.id).then((res) => {
            if(res.data.vue === true)
                setNotification((prevNotifications: Notification[]) =>
                    prevNotifications.filter((notification: Notification) => notification !== item)
                );
        }).catch((err) => { console.log(err)});
        setOpen(false);
        router.push(`/dashboard/friends`);
    }
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
    console.log(item);

    function handleGameChallenge(){

    }

    return (
        <>
            <img src={item.senderImage} alt="" className="w-10 h-10 rounded-full" />
            
            {
                item.RequestType === 'FRIENDSHIP' ?
                <div className='flex'>
                <p className="ml-2 text-white">{item?.content}</p>
                    <button className="bg-[#78196F] p-1  rounded text-[14px] text-white" onClick={handleButtonClick}>Check</button>
                </div>:
                <div className='flex items-center'>
                    <p className="ml-2 text-white">your friend is challenging you</p>
                    <button className="bg-[#78196F] p-1  rounded text-[14px] text-white" onClick={handleGameChallenge}>Check</button>
                </div>
            }
        </>
    );
}

export default NotificationItem