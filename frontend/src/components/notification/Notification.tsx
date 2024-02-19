import { ContextGlobal } from "@/context/contex";
import { Bell, DivideIcon } from "lucide-react";
import React, { use, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { getUnreadNotification, postReadNotification } from "@/api/notifications/notifications.api";
import { data } from "@/data/MatchHistory";
import NotificationItem from "./NotificationItem";
import OutsideClickHandler from 'react-outside-click-handler'

const Notification = () => {
    const { setSocket, notification ,setNotification, profile}: any = useContext(ContextGlobal);
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    useEffect(() => {
        const socket = io(`${process.env.API_BASE_URL}`, {
            autoConnect: false,
            withCredentials: true,
        });
        socket?.connect();
        socket?.on('connect', () => {
            setSocket(socket);
        });
        socket?.on('friendRequest', (data: any) => {
            if(data.notification){
                setNotification((prev: Notification[]) => [data.notification, ...prev]);
                toast.success('You have a new friend request');
            }
        });
        socket?.on('friendAcceptRequest', (data: any) => {
            if(data.notification){
                setNotification((prev: Notification[]) => [data.notification, ...prev]);
                toast.success('Your friend accepted your request');
            }
        });
        socket?.on('challengeGame', (data: any) => {
            if(data.notification){
                setNotification((prev: Notification[]) => [data.notification, ...prev]);
                toast.success('Your friend challenged you to a game');
            }
        });
        socket?.on('RequestError', (data) => {
            if(data) {
                toast.error(data);
            }
        });

        

        return () => {
            socket?.off('connect');
            socket?.off('friendRequest');
            socket?.off('friendAcceptRequest');
            socket?.off('RequestError');
            socket?.off('challengeGame');
            socket.disconnect();
        };
    }, []);


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
            { !isPlaying &&
                <div className="relative">
                <div className="flex relative cursor-pointer" onClick={() => setOpen(!open)}>
                    <Bell color="#ffff" className="color-red-500" size={30}  />
                    <span className="text-white bg-red-500 flex items-center justify-center font-bold text-[12px] rounded-full  w-[16px] h-[16px]  absolute top-0 left-4">{notification.length}</span>
                </div>
                <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
                <div className={`z-10 right-0 absolute bg-search rounded-b-lg w-[500px] h-[110px] overflow-y-auto ${open === false ? "hidden" : ""} `}>
                    {
                        open && notification.map((item :any, index:any) => (
                            <div key={index} className="flex items-center justify-between p-2 hover:bg-purple-300/50">
                            <NotificationItem item={item} setOpen={setOpen} />
                            </div>
                        ))
                    }
                </div>
                </OutsideClickHandler>
                </div>
            }
        </>
    );
};

export default Notification;