import React, { useState } from "react";

interface PopupProps {
    handleLeaveClick: () => void;
}


const LeavePopup : React.FC<PopupProps> = ({handleLeaveClick})  => {
    const handleNoClick = () => {
        handleLeaveClick();
    };

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000]/50 z-40 flex justify-center items-center font-inter">
             <div className=" bg-[#311150]/60 w-[30%] h-[100px] rounded-2xl shadow-lg font-light mx-2">
                <h1 className="text-gray-300 opacity-70 font-thin md:text-[15px] text-[12px]  text-center m-4">are you sure you want to exit?</h1>
                <div className="flex justify-evenly">
                    <div className="bg-green-500 rounded-2xl px-3 py-1 hover:transform hover:scale-105" onClick={() => console.log("No clicked")}>Yes</div>
                    <div className="bg-red-500 rounded-2xl px-4 py-1 hover:transform hover:scale-105" onClick={handleNoClick}>No</div>
                </div>
             </div>
        </div>
    )
}

export default LeavePopup