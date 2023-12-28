import React from "react";
import { ThumbsUp } from 'lucide-react';
import { ThumbsDown } from 'lucide-react';

const Piece = ({ picture, check }: { picture: string, check: boolean }) => {
    return (
            <div className="relative text-white bg-achievements1 w-[50%] ">
                <img src="/bg-ping-pong.jpeg" alt="default pic" className="h-[60%] w-full rounded-t-2xl object-cover" />
                <div className="absolute flex items-center justify-center top1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <img src={picture} alt="default pic" className="w-[50%] h-[50%] rounded-full" />
                </div>
                {check && 
                <div className="text-white flex items-center justify-around w-full h-[50%]">
                <button><ThumbsUp size={20} strokeWidth={3}/></button>
                <h1 className="font-thin text-[12px] md:text-[15px] mt-1">UserGuest</h1>
                <button><ThumbsDown size={20} strokeWidth={3}/></button></div>}
                {!check && 
                 <div className="text-white flex items-center justify-around w-full h-[50%]">
                 <button><ThumbsUp size={20} strokeWidth={3}/></button>
                 <h1 className="font-thin text-[12px] md:text-[15px] mt-1">UserGuest</h1>
                 </div>}
            </div>
    )
}

export default Piece