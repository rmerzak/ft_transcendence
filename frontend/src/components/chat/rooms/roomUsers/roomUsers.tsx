'use client'

import { getChatRoomById, getChatRoomMemberByRoomId, getChatRoomMembers } from "@/api/chat/chat.api"
import { User, X } from "lucide-react"
import { useEffect, useState } from "react"
import OutsideClickHandler from "react-outside-click-handler"
import RoomUserItem from "./roomUserItem"

function RoomUsers({ handleUserListClick, chatRoomId }: { handleUserListClick: any, chatRoomId: number | undefined}) {
    const [users, setUsers] = useState<any>([])
    const [profileRoomStatus, setProfileRoomStatus] = useState<any>({})
    const [chatRoom, setChatRoom] = useState<any>({})
    useEffect(() => {
        if(chatRoomId) {
            getChatRoomById(chatRoomId).then((res) => {
                setChatRoom(res.data);
            }).catch((err) => {});
            getChatRoomMembers(chatRoomId).then((res) => {
                setUsers(res.data)
                console.log(res.data)
            }).catch((err) => {
                console.log(err);
            });
            getChatRoomMemberByRoomId(chatRoomId).then((res) => {
                console.log(res.data);
                if(res.data)
                    setProfileRoomStatus(res.data)
            }).catch((err) => {
                //throw err; must ask about the catch error what to do
            });
        }
    },[])
    return (
        <>
            <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000]/50 z-50 flex justify-center items-center font-inter">
                <OutsideClickHandler onOutsideClick={handleUserListClick}>
                    <div className="bg-[#311150]/80 w-[550px] h-[200px] rounded-3xl shadow-lg font-light mx-2">
                        <div>
                            <div className="flex justify-between items-center px-4 py-2">
                                <h1 className="text-xl">Members</h1>
                                <button onClick={handleUserListClick}>
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            {
                                users.map((user: any) => (
                                    <RoomUserItem chatRoom={chatRoom} profileRoomStatus={profileRoomStatus} chatRoomMember={user} chatRoomRole={user.user.id === chatRoom.owner ? "owner" : user.is_admin === true ? "admin" : "member"} />
                                ))
                            }

                        </div>
                    </div>
                </OutsideClickHandler>
            </div>
        </>
    )
}

export default RoomUsers
