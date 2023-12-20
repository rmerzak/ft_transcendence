"use client";
import React, { useState } from "react";
import { LockKeyhole } from 'lucide-react';
import { UnlockKeyhole } from 'lucide-react';


export const BlackList = () => {
    const [isLocked, setIsLocked] = useState(true);

    const toggleLock = () => {
        setIsLocked(!isLocked);
    };

    return (
        <div  className="text-gray-400 pb-6 bg-achievements md:w-[24%] h-full mt-2">
            <div className="pb-1 text-gray-300 text-[15px] font-thin w-full flex items-center justify-center pt-2">Black List</div>
            <div className="border-b border-gray-200 w-[30px] mx-auto mb-7"></div>
            <div className="bg-black-list flex w-fill mx-3 mb-3 items-center">
            <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] md:mx-2 my-1 rounded-full">
                   <img src="/dfpic.png" alt="default pic"/>
                </div>
                <div className="text-gray-200 text-[15px] font-thin ">Testtttttttttt</div>
                <button onClick={toggleLock} className="ml-auto mr-4">
                    {isLocked ? (
                        <LockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF" />
                    ) : (
                        <UnlockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF" />
                    )}
                </button>
            </div>

            <div className="bg-black-list flex w-fill mx-3 mb-3  items-center">
            <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] md:mx-2 my-1 rounded-full">
                   <img src="/dfpic.png" alt="default pic"/>
                </div>
                <div className="text-gray-200 text-[15px] font-thin ">Testtfsdfds</div>
                <button onClick={toggleLock} className="ml-auto mr-4">
                    {isLocked ? (
                        <LockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF" />
                    ) : (
                        <UnlockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF" />
                    )}
                </button>
            </div>


            <div className="bg-black-list flex w-fill mx-3 mb-3  items-center">
            <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] md:mx-2 my-1 rounded-full">
                   <img src="/dfpic.png" alt="default pic"/>
                </div>
                <div className="text-gray-200 text-[15px] font-thin ">Tesfdsfdsf</div>
                <button onClick={toggleLock} className="ml-auto mr-4">
                    {isLocked ? (
                        <LockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF" />
                    ) : (
                        <UnlockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF" />
                    )}
                </button>
            </div>


            <div className="bg-black-list flex w-fill mx-3 mb-3  items-center">
            <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] md:mx-2 my-1 rounded-full">
                   <img src="/dfpic.png" alt="default pic"/>
                </div>
                <div className="text-gray-200 text-[15px] font-thin ">Testttewew</div>
                <button onClick={toggleLock} className="ml-auto mr-4">
                    {isLocked ? (
                        <LockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF" />
                    ) : (
                        <UnlockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF" />
                    )}
                </button>
            </div>


            <div className="bg-black-list flex w-fill mx-3 mb-3  items-center">
            <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] md:mx-2 my-1 rounded-full">
                   <img src="/dfpic.png" alt="default pic"/>
                </div>
                <div className="text-gray-200 text-[15px] font-thin ">Testtttewewt</div>
                <button onClick={toggleLock} className="ml-auto mr-4">
                    {isLocked ? (
                        <LockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF" />
                    ) : (
                        <UnlockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF" />
                    )}
                </button>
            </div>

        </div>
    )
}

export default BlackList