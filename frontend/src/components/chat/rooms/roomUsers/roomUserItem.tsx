import { ChatRoomMember } from '@/interfaces'
import React from 'react'

function roomUserItem({chatRoomMember}: {chatRoomMember: ChatRoomMember}) {
    return (
        <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-[#A1A1A1]">
                <img src={chatRoomMember.user.image ? chatRoomMember.user.image : "/images/blank.png"} alt="" className="w-full h-full rounded-full" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-lg">{chatRoomMember.user.username}</h1>
                <h1 className="text-sm text-[#A1A1A1]">{chatRoomMember.is_admin}</h1>
            </div>
        </div>
    )
}

export default roomUserItem
