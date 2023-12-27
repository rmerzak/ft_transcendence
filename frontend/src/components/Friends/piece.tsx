import React from "react";
import { ThumbsUp } from 'lucide-react';
import { ThumbsDown } from 'lucide-react';

const Piece = ({ picture }: { picture: string }) => {
    return (
            <div className="relative text-white bg-achievements1 w-[60%] ">
                <img src="/bg-ping-pong.jpeg" alt="default pic" className="h-[60%] w-full rounded-t-2xl object-cover" />
                <div className="absolute flex items-center justify-center top1/2 -translate-y-1/2">
                    <img src={picture} alt="default pic" className="w-[30%] rounded-full" />
                </div>
                <div className="text-white flex items-center justify-around w-full h-[50%]">
                <button><ThumbsUp size={20} strokeWidth={3}/></button>
                <h1 className="font-thin text-[6px] md:text-[15px]">UserGuest</h1>
                <button><ThumbsDown size={20} strokeWidth={3}/></button></div>
            </div>
    )
}

export default Piece