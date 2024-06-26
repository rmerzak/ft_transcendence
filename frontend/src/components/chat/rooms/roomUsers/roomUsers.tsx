'use client'
import { useContext } from "react"
import { getChatRoomById, getChatRoomInvitedMembers, getChatRoomMemberByRoomId, getChatRoomMembers } from "@/api/chat/chat.api"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import OutsideClickHandler from "react-outside-click-handler"
import RoomUserItem from "./roomUserItem"
import { ContextGlobal } from "@/context/contex"
import { ChatRoom, ChatRoomInvitedMembers } from "@/interfaces"
import RoomInvitedUserItem from "./RoomInvitedUserItem"


function RoomUsers({ handleUserListClick, chatRoomId }: { handleUserListClick: any, chatRoomId: number | undefined }) {
    const [users, setUsers] = useState<any>([])
    const [profileRoomStatus, setProfileRoomStatus] = useState<any>({})
    const [chatRoom, setChatRoom] = useState<ChatRoom>({})
    const [InvitedMembers, setInvitedMembers] = useState<ChatRoomInvitedMembers[]>([])

    const { chatSocket, profile } = useContext(ContextGlobal)
    function updateComponent(id: number) {
        getChatRoomById(id).then((res: any) => {
            
            if (res.data)
                setChatRoom(res.data);
        }).catch((err) => { });
        getChatRoomMembers(id).then((res) => {
            if (res.data)
                setUsers(res.data)
            
        }).catch((err) => {
           
        });
        getChatRoomMemberByRoomId(id).then((res) => {
            
            if (res.data)
                setProfileRoomStatus(res.data)
        }).catch((err) => { });
        getChatRoomInvitedMembers(id).then((res) => {
            if (res.data)
                setInvitedMembers(res.data)
            
        }).catch((err) => { });
    }
    useEffect(() => {
        if (chatRoomId && chatSocket) {
            updateComponent(chatRoomId);
            chatSocket?.on('request-join-room', () => {
                updateComponent(chatRoomId);
            })
            chatSocket?.on('accept-join-room', () => {
                updateComponent(chatRoomId);
            })
            chatSocket?.on('reject-join-room', () => {
                updateComponent(chatRoomId);
            })
            chatSocket?.on('update-room_msgRm', (room) => {
                if (room)
                    updateComponent(chatRoomId);
            });
            chatSocket?.on('update_chat_room_member_roomUsers', (res) => {
                
                if (chatRoomId && res.chatRoomId === chatRoomId) {
                    getChatRoomMembers(chatRoomId).then((res) => {
                        setUsers(res.data)
                    }).catch((err) => {
                        
                    });
                    getChatRoomMemberByRoomId(chatRoomId).then((res) => {
                        if (res.data)
                            setProfileRoomStatus(res.data)
                    }).catch((err) => {
                        
                    });
                    updateComponent(chatRoomId);
                }
            })

        }
        return () => {
            chatSocket?.off('request-join-room');
            chatSocket?.off('update_chat_room_member_roomUsers');
            chatSocket?.off('accept-join-room');
            chatSocket?.off('reject-join-room');
            chatSocket?.off('update-room_msgRm');
        };
    }, [chatRoomId, chatSocket])

    return (
        <>
            <div className=" fixed top-0 left-0 w-screen h-screen bg-[#000000]/50 z-50 flex justify-center items-center font-inter">
                <OutsideClickHandler onOutsideClick={handleUserListClick}>
                    <div className=" bg-[#311150]/80 w-[550px] h-[300px] rounded-3xl shadow-lg font-light mx-2">
                        <div>
                            <div className="flex justify-between items-center px-4 py-2">
                                <h1 className="text-xl">Members</h1>
                                <button onClick={handleUserListClick}>
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="overflow-auto h-[120px]">

                                {
                                    users.map((user: any, index: number) => (
                                        <RoomUserItem key={index} chatRoom={chatRoom} profileRoomStatus={profileRoomStatus} chatRoomMember={user} chatRoomRole={user.user.id === chatRoom.owner ? "owner" : user.is_admin === true ? "admin" : "member"} />
                                    ))
                                }
                            </div>
                        </div>
                        {chatRoom && chatRoom?.owner === profile?.id &&
                            <div>
                                <div className="flex justify-between items-center px-4 py-2 mt-3">
                                    <h1 className="text-xl">Invited Members</h1>
                                </div>
                                <div className="overflow-auto h-[80px]">
                                    {
                                        InvitedMembers.map((invited: ChatRoomInvitedMembers, index: number) => (
                                            <RoomInvitedUserItem key={index} chatRoom={chatRoom} RoomInvitedMember={invited} />
                                        ))
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </OutsideClickHandler>
            </div>
        </>
    )
}

export default RoomUsers
