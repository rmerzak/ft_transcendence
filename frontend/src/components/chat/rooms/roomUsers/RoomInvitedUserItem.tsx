'use client'

import { ChatRoomInvitedMembers } from "@/interfaces"
import { formatDate } from "../../msg/chat"
import { FaCircleCheck,FaCircleXmark } from "react-icons/fa6"
import { ContextGlobal } from "@/context/contex";
import { useContext } from "react";

function RoomInvitedUserItem({ RoomInvitedMember, chatRoom }: { RoomInvitedMember: ChatRoomInvitedMembers, chatRoom: any }) {
    const { socket } = useContext(ContextGlobal);
    function HandleAcceptUser() {
        console.log("accept user")
    }
    function HandleRefuseUser() {
        console.log("refuse user")
    }
    return (
        <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-[#A1A1A1]">
                <img src={RoomInvitedMember.sender.image ? RoomInvitedMember.sender.image : "/images/blank.png"} alt="" className="w-full h-full rounded-full" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-lg">{RoomInvitedMember.sender.username}</h1>
                <h2 className="text-sm text-[#A1A1A1]">
                    send: {formatDate(RoomInvitedMember.createdAt)}
                </h2>
            </div>
            <div className=' flex items-center justify-center space-x-2'>
                <button onClick={() => { HandleAcceptUser() }} className="bg-[#A1A1A1] rounded-full px-2 py-1">
                <FaCircleCheck />
                </button>
                <button onClick={() => { HandleRefuseUser() }} className="bg-[#A1A1A1] rounded-full px-2 py-1">
                <FaCircleXmark />
                </button>

            </div>
        </div>
    )
}

export default RoomInvitedUserItem
