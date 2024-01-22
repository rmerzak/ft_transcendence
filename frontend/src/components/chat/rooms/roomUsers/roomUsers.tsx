'use client'

import { User, X } from "lucide-react"
import { useEffect } from "react"
import OutsideClickHandler from "react-outside-click-handler"

function RoomUsers({ handleUserListClick }: { handleUserListClick: any }) {
    useEffect(() => {
        console.log("RoomUsers")
    })
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
                            <div className="flex flex-col gap-2 px-4 py-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-10 h-10 rounded-full bg-[#A1A1A1]"></div>
                                    <div className="flex flex-col">
                                        <h1 className="text-lg">User 1</h1>
                                        <h1 className="text-sm text-[#A1A1A1]">Owner</h1>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-10 h-10 rounded-full bg-[#A1A1A1]"></div>
                                    <div className="flex flex-col">
                                        <h1 className="text-lg">User 2</h1>
                                        <h1 className="text-sm text-[#A1A1A1]">Admin</h1>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </OutsideClickHandler>
            </div>
        </>
    )
}

export default RoomUsers
