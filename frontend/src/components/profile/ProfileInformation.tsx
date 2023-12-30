'use client'
import { ContextGlobal } from "@/context/contex";
import { User } from "@/interfaces"
import { LoaderIcon, UserCheck, UserMinus } from "lucide-react";
import { UserPlus } from 'lucide-react';

import Image from "next/image"
import { useContext, useEffect, useState } from "react";
import { getFriendshipStatus } from "@/api/friendship/friendship.api";
const ProfileInformation = ({ profile, BtnFriend }: { profile: User, BtnFriend: boolean }) => {
    const { socket }: any = useContext(ContextGlobal);
    const [friend, setFriend] = useState<boolean | null>(null);
    const [friendship, setFriendship] = useState<any>(null);
    function HandleUnfriend() {
        socket.emit('removeFriend', profile?.id);
        setFriend(null);
    }
    function HandleSendFriendRequest() {
        socket.emit('friendRequest', profile?.id);
        setFriend(false);
    }
    function HandleAccepteFriendRequest() {
        socket.emit('friendAcceptRequest', profile?.id);
        setFriend(true);
    }
    useEffect(() => {
        getFriendshipStatus(profile?.id).then((res) => {
            console.log("friendship status = ", res.data);
            if (res.data.status === 'ACCEPTED')
                setFriend(true);
            if (res.data.status === 'PENDING')
                setFriend(false);
            setFriendship(res.data);
            socket.on('friendRequest', (data: any) => {
                setFriend(false);
            });
            socket.on('friendAcceptRequest', (data: any) => {
                setFriend(true);
            });
            socket.on('removeFriend', (data: any) => {
                setFriend(null);
            });

        }).catch((err) => { console.log(err) });
    }, [socket, friend]);
    return (
        <div className="bg-mberri w-full flex items-end relative">
            <div className="bg-mberri1 flex items-center justify-evenly w-full backdrop-blur-sm relative">
                <div>
                    <p className="text-[#CE6FF5]">First Name</p>
                    <p className="text-[#FFFFFF] text-opacity-50">{profile?.firstname}</p>
                </div>
                <div>
                    <p className="text-[#CE6FF5]">Last Name</p>
                    <p className="text-[#FFFFFF] text-opacity-50">{profile?.lastname}</p>
                </div>
                <div>
                    <p className="text-[#CE6FF5]">Nick Name</p>
                    <p className="text-[#FFFFFF] text-opacity-50">{profile?.username}</p>
                </div>
                <div>
                    <p className="text-[#CE6FF5]">Email</p>
                    <p className="text-[#FFFFFF] text-opacity-50">{profile?.email}</p>
                </div>
                {BtnFriend && <div>
                    {friend === true ? (
                        <button className="text-red-500 pl-1" onClick={HandleUnfriend}>
                            <UserMinus />
                        </button>
                    ) : friend === null ? (
                        <button className="text-blue-500 pl-1" onClick={HandleSendFriendRequest}>
                            <UserPlus /> Send Request
                        </button>
                    ) : (
                         (friendship?.senderId === profile?.id && friend === false) ?
                            <button className="text-blue-500 pl-1" onClick={HandleAccepteFriendRequest}>
                                <UserCheck /> Accept
                            </button> 
                                : 
                            <button className="text-blue-500 pl-1">
                                <LoaderIcon />
                            </button>
                    )}
                </div>
                }
            </div>
            <div className="w-full flex items-end justify-between absolute top-12 left-0">
                <div>
                    <div className="relative w-[120px] h-[120px] rounded-full ml-3">
                        <Image src={profile?.image} alt="profile pic" width={100} height={100} className="rounded-full" />
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] h-[15px] w-[15px] rounded-full bg-custom-green"></div>
                    </div>
                </div>
                <div>
                    <p className="text-gray-300 font-thin ml-1">Freax</p>
                    <Image src="/freax.png" alt="freax" width={100} height={100} style={{ width: "50px", height: "101px", marginRight: "15px" }} />
                </div>
            </div>
        </div>
    )
}

export default ProfileInformation