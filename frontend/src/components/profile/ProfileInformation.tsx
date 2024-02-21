'use client'
import { ContextGlobal } from "@/context/contex";
import { Friendship, User } from "@/interfaces"
import { LoaderIcon, UserCheck, UserMinus } from "lucide-react";
import { UserPlus } from 'lucide-react';

import Image from "next/image"
import { useContext, useEffect, useState } from "react";
import { getFriendshipStatus } from "@/api/friendship/friendship.api";
const ProfileInformation = ({ profile, BtnFriend }: { profile: User, BtnFriend: boolean }) => {
    const { socket } = useContext(ContextGlobal);
    const [friend, setFriend] = useState<boolean | null>(null);
    const [block, setBlock] = useState<boolean> (false);
    const [friendship, setFriendship] = useState<Friendship>();
    function HandleUnfriend() {
        console.log('unfriend');
        socket?.emit('removeFriend', profile?.id);
        setFriend(null);
    }
    function HandleSendFriendRequest() {
        socket?.emit('friendRequest', profile?.id);
        setFriend(false);
    }
    function HandleAccepteFriendRequest() {
        socket?.emit('friendAcceptRequest', profile?.id);
        setFriend(true);
    }
    useEffect(() => {
        getFriendshipStatus(profile?.id).then((res) => {

            if (res.data.status === 'ACCEPTED')
                setFriend(true);
            if (res.data.status === 'PENDING')
                setFriend(false);
            setFriendship(res.data);
            socket?.on('friendRequest', (data: any) => {
                if (data.status) {
                    setFriend(false);
                }
            });
            socket?.on('friendAcceptRequest', (data: any) => {
                if (data.notification) {
                    setFriend(true);
                }
            });
            socket?.on('removeFriend', (data: any) => {
                if (data.status === true) {
                    setFriend(null);
                }
            });
            socket?.on('blockFriend', (data: any) => {
                if (data.notification) {
                    setFriend(null);
                }
            })
            socket?.on('unblockFriend', (data: any) => {
                if (data.notification) {
                    setFriend(true);
                }
            })
            

        }).catch((err) => { });
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
                {friendship?.status !== 'BLOCKED' && BtnFriend && <div className="w-[100px]">
                    {friend === true ? (
                        <button className="text-red-500 pl-1 w-[100px] h-[40px]" onClick={HandleUnfriend}>
                            <UserMinus/>remove
                        </button>
                    ) : friend === null ? (
                        <button className="text-blue-500 pl-1 w-[100px] h-[40px]" onClick={HandleSendFriendRequest}>
                            <UserPlus /> add Friend
                        </button>
                    ) : (
                         (friendship?.senderId === profile?.id && friend === false) ?
                            <button className="text-blue-500 pl-1 w-[100px] h-[40px]" onClick={HandleAccepteFriendRequest}>
                                <UserCheck /> Accept
                            </button> 
                                : 
                            <button className="text-blue-500 pl-1 w-[100px] h-[]">
                                <LoaderIcon />
                            </button>
                    )}
                </div>
                }
            </div>
            <div className="w-full flex items-end justify-between absolute top-12 left-0">
                <div>
                    <div className="relative w-[120px] h-[120px] rounded-full ml-3">
                        <img src={profile?.image} alt="profile pic" className="rounded-full w-[100px] h-[100px]" />
                        {friendship?.status !== 'BLOCKED' && friend === true && (
                        <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] h-[15px] w-[15px] rounded-full ${profile?.status === 'ONLINE' ? 'bg-custom-green' : profile?.status === 'INGAME' ? 'bg-orange-400' : 'bg-gray-400'}`}></div>
                        )}</div>
                </div>
                <div className="md:w-24 md:mr-0 mr-2 w-10 flex  flex-col items-center">
                    <p className="text-[#FFFFFF] text-opacity-50 md:text-[16px] text-[10px] ">{profile?.coaltion}</p>
                    <img src={`/${profile?.coaltion}.png`} alt="freax"  className="rounded-b-full  md:w-16 md:h-full w-10 h-[80%] opacity-80 shadow-lg" />
                </div>
            </div>
        </div>
    )
}

export default ProfileInformation;