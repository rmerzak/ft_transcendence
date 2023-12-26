import React from "react";
import { ThumbsUp } from 'lucide-react';
import { ThumbsDown } from 'lucide-react';

const Piece = ({ picture }: { picture: string }) => {
    return (
            <div className="relative text-white bg-achievements1 w-[96%] h-[160px]">
                <img src="/bg-ping-pong.jpeg" alt="default pic" className="mb-6 h-[50%] w-full rounded-t-2xl object-cover" />
                <div className="absolute left-0 top-12 md:left-[40%]">
                    <img src={picture} alt="default pic" className="w-[50px] h-[50px] rounded-full" /></div>
                <div className="text-[#FFFFFF] flex items-center justify-evenly font-thin text-[6px] md:text-[12px] w-full">User123</div>
                <div className="mt-2 text-[#FFFFFF] flex justify-around">
                <button className="rounded-full"><ThumbsUp size={16} strokeWidth={3}/></button>
                <button className="rounded-full"><ThumbsDown size={16} strokeWidth={3}/></button></div>
            </div>
    )
}

export default Piece