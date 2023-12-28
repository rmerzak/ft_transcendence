import { ContextGlobal } from "@/context/contex";
import { Bell } from "lucide-react";
import React, { use, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const Notification = () => {
    const { socket, setSocket }: any = useContext(ContextGlobal);
    const [notification, setNotification] = useState<any[]>([]);
    useEffect(() => {
        const socket = io("http://localhost:3000", {
            autoConnect: false,
            withCredentials: true,
        });
        socket.connect();
        socket.on('connect', () => {
            console.log('Connected to the server');
            console.log(socket);
            setSocket(socket);
        });
        socket.on('friendRequest', (data: any) => {
            setNotification((prev) => [...prev, data]);
            console.log('You have a new friend request');
            console.log("data", data);
            toast.success('You have a new friend request');
        });
        socket.on('friendAcceptRequest', (data: any) => {
            setNotification((prev) => [...prev, data]);
            toast.success('Your friend accepted your request');
            console.log(data);
        });
        return () => {
            console.log("Cleanup: Disconnecting socket");
            socket.disconnect();
        };
    }, []);
    return (
        <div className="flex relative">
            <Bell color="#ffff" className="color-red-500" size={30} />
            <span className="text-white bg-red-500 flex items-center justify-center font-bold text-[12px] rounded-full  w-[16px] h-[16px]  absolute top-0 left-4">{notification.length}</span>
        </div>
    );
};

export default Notification;