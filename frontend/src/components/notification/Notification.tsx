import { ContextGlobal } from "@/context/contex";
import { Bell, DivideIcon } from "lucide-react";
import React, { use, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { getUnreadNotification } from "@/api/notifications/notifications.api";
import { data } from "@/data/MatchHistory";
import NotificationItem from "./NotificationItem";
import OutsideClickHandler from 'react-outside-click-handler';
const Notification = () => {
    const { setSocket, notification ,setNotification}: any = useContext(ContextGlobal);
    const [open, setOpen] = useState<boolean>(false);
    useEffect(() => {
        const socket = io("http://localhost:3000", {
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
        socket?.on('RequestError', (data) => {
            if(data.error) {
                toast.error(data.error);
            }
        });
        return () => {
            socket?.off('connect');
            socket?.off('friendRequest');
            socket?.off('friendAcceptRequest');
            socket?.off('RequestError');
            socket.disconnect();
        };
    }, []);
    return (
        <div className="relative">
        <div className="flex relative " onClick={() => setOpen(!open)}>
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
    );
};

export default Notification;