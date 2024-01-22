'use client'
import { ContextGlobal } from "@/context/contex";
import React, { useContext, useEffect, useState } from "react";


interface PopupProps {
  onClose: () => void;
}

const ChannelSettingPopup: React.FC<PopupProps> = ({ onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup-content">
        <h2>Channel Settings</h2>
        <p>Add your settings content here.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ChannelSettingPopup;
