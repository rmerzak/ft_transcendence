// ChannelSettingPopup.tsx
import { ContextGlobal } from "@/context/contex";
import React, { useContext, useEffect, useState } from "react";
import { X } from 'lucide-react';

interface PopupProps {
  onClose: () => void;
}

const ChannelSettingPopup: React.FC<PopupProps> = ({ onClose }) => {
  return (
    <div className="fixed top-0 right-0 w-screen h-screen  flex justify-center ">
      <div className=" bg-red-500 w-[30%] h-[20%] rounded-xl" >
        <h2>Channel Settings</h2>
        <p>Add your settings content here.</p>
        <button onClick={onClose} className="text-white"><X  size={24} strokeWidth={2.5}/></button>
      </div>
    </div>
  );
};

export default ChannelSettingPopup;
