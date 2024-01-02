import { ContextGlobal } from "@/context/contex";
import { Bell, DivideIcon } from "lucide-react";
import React, { use, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { getUnreadNotification } from "@/api/notifications/notifications.api";
import { data } from "@/data/MatchHistory";
import NotificationItem from "./NotificationItem";
const Notification = () => {
    const { setSocket, notification ,setNotification}: any = useContext(ContextGlobal);
    const [open, setOpen] = useState<boolean>(false);
    useEffect(() => {
        const socket = io("http://localhost:3000", {
            autoConnect: false,
            withCredentials: true,
        });
        socket.connect();
        socket.on('connect', () => {
            setSocket(socket);
        });
        socket.on('friendRequest', (data: any) => {
            if (data)
                setNotification((prev: Notification[]) => [data, ...prev]);
            toast.success('You have a new friend request');
        });
        socket.on('friendAcceptRequest', (data: any) => {
            if(data)
                setNotification((prev: Notification[]) => [data, ...prev]);
            toast.success('Your friend accepted your request');
            console.log(data);
        });
        socket.on('RequestError', (data) => {
            console.log(data.error);
            toast.error(data.error);
        });
        return () => {
            console.log("Cleanup: Disconnecting socket");
            socket.disconnect();
        };
    }, []);
    return (
        <div className="relative">
        <div className="flex relative " onClick={() => setOpen(!open)}>
            <Bell color="#ffff" className="color-red-500" size={30}  />
            <span className="text-white bg-red-500 flex items-center justify-center font-bold text-[12px] rounded-full  w-[16px] h-[16px]  absolute top-0 left-4">{notification.length}</span>
        </div>
        <div className="z-10 right-0 absolute bg-search rounded-b-lg w-[500px]">
            {
                open && notification.map((item :any, index:any) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-purple-300/50">
                       <NotificationItem item={item} setOpen={setOpen} />
                    </div>
                ))
            }
        </div>
        </div>
    );
};

export default Notification;