import { ContextGlobal } from "@/context/contex";
import React, { useContext, useEffect, useState } from "react";
import { ChatRoom, RoomVisibility } from "@/interfaces";

interface PopupProps {
  handleSettingClick: () => void;
  chatRoom: ChatRoom | undefined;
}


const ChannelSettingPopup: React.FC<PopupProps> = ({ handleSettingClick, chatRoom }) => {
  const { chatSocket } = useContext(ContextGlobal);
  const [formData, setFormData] = useState<ChatRoom>({});

  useEffect(() => {
    if (chatRoom)
      setFormData(chatRoom);
  }, [chatRoom]);

  useEffect(() => {
    if (formData.visibility !== RoomVisibility.PROTECTED) {
      setFormData((prevData) => ({
        ...prevData,
        passwordHash: null,
      }));
    }
  }, [formData.visibility]);


  const handleVisibilityChange = (visibility: RoomVisibility) => {
    setFormData((prevData) => ({
      ...prevData,
      visibility,
    }));
  };

  const handleExit = () => {
    handleSettingClick();
  };

  const handleSave = () => {
    chatSocket?.emit("update-room", {
      ...formData,
      id: chatRoom?.id,
    });
    handleSettingClick();
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000]/50 z-40 flex justify-center items-center font-inter">
      <div className=" bg-[#311150]/80 w-[45%] h-[200px] rounded-3xl shadow-lg font-light mx-2">
        <div className="flex justify-evenly w-full">
          <h1 className="text-xl mt-5 ml-2">Change Name:</h1>
          <div className="flex">
            <input
              type="text"
              className="bg-gray-800 text-white mt-4 border-none rounded-xl focus:ring-0 h-9 md:w-3/4 focus:outline-none"
              placeholder={`${chatRoom?.name}`}
              required
              onChange={(e) => {setFormData((prevData) => ({ ...prevData, name: e.target.value }))}}
            />
          </div>
        </div>
        <div className="text-white font-light text-lg flex justify-center items-center space-x-1 mt-3 mb-1">
          <fieldset className="flex justify-between items-center space-x-4 w-[67.5%] h-10 p-2" id="safe">
            <div className="space-x-1 flex justify-center items-center text-base md:text-lg">
              <input
                type="radio"
                name="safe"
                id="public"
                onChange={() => handleVisibilityChange(RoomVisibility.PUBLIC)}
                checked={formData.visibility === RoomVisibility.PUBLIC}
              />
              <label htmlFor="public">public</label>
            </div>
            <div className="space-x-1 flex justify-center items-center text-base md:text-lg">
              <input
                type="radio"
                name="safe"
                id="protected"
                onChange={() => handleVisibilityChange(RoomVisibility.PROTECTED)}
                checked={formData.visibility === RoomVisibility.PROTECTED}
              />
              <label htmlFor="protected">protected</label>
            </div>
            <div className="space-x-1 flex justify-center items-center text-base md:text-lg">
              <input
                type="radio"
                name="safe"
                id="private"
                onChange={() => handleVisibilityChange(RoomVisibility.PRIVATE)}
                checked={formData.visibility === RoomVisibility.PRIVATE}
              />
              <label htmlFor="private">private</label>
            </div>
          </fieldset>
        </div>
        {formData.visibility === RoomVisibility.PROTECTED && (
          <div className="flex justify-evenly w-full ">
            {chatRoom?.visibility === RoomVisibility.PROTECTED ? <div>
              <p className="text-[8px] text-center">(optional)</p>
              <label className="text-xl">change password:</label>
            </div> : <label className="text-xl">set password:</label>}
            <input
              type="password"
              className="bg-gray-800 text-white border-none rounded-xl focus:ring-0 h-10 md:w-3/6 focus:outline-none"
              placeholder="Enter password"
              // value={formData.passwordHash}
              required
              onChange={(e) => setFormData((prevData) => ({ ...prevData, passwordHash: e.target.value }))}
            />
          </div>
        )}
        <div className="flex justify-around w-full mt-3 ">
          <button onClick={handleSave} className=" bg-[#811B77]/80 border text-white rounded-lg md:w-1/6 focus:outline-none hover:bg-green-400">
            <h1>Save</h1>
          </button>
          <button onClick={handleExit} className=" bg-[#811B77]/80 border text-white rounded-lg md:w-1/6 focus:outline-none hover:bg-red-400">
            <h1>Exit</h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelSettingPopup;
