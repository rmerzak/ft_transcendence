import { ContextGlobal } from "@/context/contex";
import React, { useContext, useEffect, useState } from "react";
import { X } from 'lucide-react';
import { ChatRoom } from "@/interfaces";
import { Check } from 'lucide-react';

interface PopupProps {
 handleSettingClick: () => void;
 chatRoom: ChatRoom | undefined;
}

const ChannelSettingPopup: React.FC<PopupProps> = ({ handleSettingClick, chatRoom }) => {
  const [inputValue, setInputValue] = useState("");

  // Handle the change in the input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Update the channel name when the user clicks on the button
  const handleNameChange = () => {
    if (chatRoom) {
      // Use the entered value as the new channel name
      chatRoom.name = inputValue;
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000]/50 z-40 flex justify-center items-center font-inter">
      <div className="bg-[#311150]/80 w-[550px] h-[200px]  shadow-lg font-light mx-2">
            <div className="flex justify-between w-full">
              <h1 className="text-xl mt-5 ml-2">Change Name:</h1>
            <div className="flex">
              <input
                type="text"
                className="bg-gray-800 text-white mt-3 border-none  rounded-l-xl focus:ring-0 h-10 md:w-3/4 focus:outline-none"
                placeholder="#newName"
                value={inputValue}
                onChange={handleInputChange}
              />
              <button onClick={handleNameChange} className="pr-1 bg-green-500 mt-3 text-white rounded-r-xl  md:w-1/7 focus:outline-none " ><Check size={24} strokeWidth={2.5}/></button>
            </div>
            <button onClick={() => { handleSettingClick()}}>
              <X className="text-red-500 -mt-4" size={24} strokeWidth={2.5}/>
            </button>
          </div>
        </div>
      </div>
  );
};

export default ChannelSettingPopup;
