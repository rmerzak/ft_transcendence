'use client'
import { use, useContext } from "react"
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

    const { chatSocket } = useContext(ContextGlobal)
    function updateComponent(id: number) {
        getChatRoomById(id).then((res: any) => {
            console.log(res.data)
            if (res.data)
                setChatRoom(res.data);
        }).catch((err) => { });
        getChatRoomMembers(id).then((res) => {
            if (res.data)
                setUsers(res.data)
            console.log(res.data)
        }).catch((err) => {
            console.log(err);
        });
        getChatRoomMemberByRoomId(id).then((res) => {
            console.log(res.data);
            if (res.data)
                setProfileRoomStatus(res.data)
        }).catch((err) => {
            //throw err; must ask about the catch error what to do
        });
        getChatRoomInvitedMembers(id).then((res) => {
            if (res.data)
                setInvitedMembers(res.data)
            console.log("req = ", res.data)
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
            // console.log("chatRoomId = ", chatRoomId)
            // console.log("chatSocket = ", chatSocket)
            chatSocket?.on('update_chat_room_member_roomUsers', (res) => {
                console.log("res = ", res)
                if (chatRoomId && res.chatRoomId === chatRoomId) {
                    getChatRoomMembers(chatRoomId).then((res) => {
                        setUsers(res.data)
                    }).catch((err) => {
                        console.log(err);
                    });
                    getChatRoomMemberByRoomId(chatRoomId).then((res) => {
                        if (res.data)
                            setProfileRoomStatus(res.data)
                    }).catch((err) => {
                        console.log(err);
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

    // useEffect(() => {
    //     if (chatRoomId && chatSocket) {
    //         getChatRoomById(chatRoomId).then((res) => {
    //             setChatRoom(res.data);
    //         }).catch((err) => { });
    //         getChatRoomMembers(chatRoomId).then((res) => {
    //             setUsers(res.data)
    //             console.log(res.data)
    //         }).catch((err) => {
    //             console.log(err);
    //         });
    //         getChatRoomMemberByRoomId(chatRoomId).then((res) => {
    //             console.log(res.data);
    //             if (res.data)
    //                 setProfileRoomStatus(res.data)
    //         }).catch((err) => {
    //             //throw err; must ask about the catch error what to do
    //         });
    //         chatSocket?.on('update_chat_room_member_roomUsers', (res) => {
    //             if (chatRoomId && res.chatRoomId === chatRoomId)
    //             {
    //                 getChatRoomMembers(chatRoomId).then((res) => {
    //                     setUsers(res.data)
    //                 }).catch((err) => {
    //                     console.log(err);
    //                 });
    //                 getChatRoomMemberByRoomId(chatRoomId).then((res) => {
    //                     if (res.data)
    //                         setProfileRoomStatus(res.data)
    //                 }).catch((err) => {
    //                     console.log(err);
    //                 });
    //             }
    //         })
    //         // chatSocket?.on('ban_from_room', (res) => {
    //         //     if (chatRoomId && res.roomId === chatRoomId)
    //         //     {
    //         //         getChatRoomMembers(chatRoomId).then((res) => {
    //         //             setUsers(res.data)
    //         //         }).catch((err) => {
    //         //             console.log(err);
    //         //         });
    //         //         getChatRoomMemberByRoomId(chatRoomId).then((res) => {
    //         //             if (res.data)
    //         //                 setProfileRoomStatus(res.data)
    //         //         }).catch((err) => {
    //         //             console.log(err);
    //         //         });
    //         //     }
    //         // })
    //     }
    //     return () => {
    //         chatSocket?.off('update_chat_room_member_roomUsers');
    //         // chatSocket?.off('ban_from_room');
    //     }
    // }, [chatRoomId, chatSocket])

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
                                users.map((user: any, index: number) => (
                                    <RoomUserItem key={index} chatRoom={chatRoom} profileRoomStatus={profileRoomStatus} chatRoomMember={user} chatRoomRole={user.user.id === chatRoom.owner ? "owner" : user.is_admin === true ? "admin" : "member"} />
                                ))
                            }
                        </div>
                        <div>
                            <div className="flex justify-between items-center px-4 py-2">
                                <h1 className="text-xl">Invited Members</h1>
                            </div>
                            {
                                InvitedMembers.map((invited: ChatRoomInvitedMembers, index: number) => (
                                    <RoomInvitedUserItem key={index} chatRoom={chatRoom} RoomInvitedMember={invited} />
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
