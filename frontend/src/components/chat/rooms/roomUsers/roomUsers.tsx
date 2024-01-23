'use client'

import { getChatRoomMembers } from "@/api/chat/chat.api"
import { User, X } from "lucide-react"
import { useEffect, useState } from "react"
import OutsideClickHandler from "react-outside-click-handler"
import RoomUserItem from "./roomUserItem"

function RoomUsers({ handleUserListClick, chatRoom }: { handleUserListClick: any, chatRoom: any }) {
    const [users, setUsers] = useState<any>([])
    useEffect(() => {
        if(chatRoom) {
            getChatRoomMembers(chatRoom.id).then((res) => {
                setUsers(res.data)
                console.log(res.data)
            }).catch((err) => {
                console.log(err);
            });
        
        console.log("RoomUsers")
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
                                    <RoomUserItem chatRoom={chatRoom} chatRoomMember={user} chatRoomRole={user.user.id === chatRoom.owner ? "owner" : user.is_admin === true ? "admin" : "member"} />
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
