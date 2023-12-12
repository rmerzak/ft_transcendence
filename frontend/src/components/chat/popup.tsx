import React from "react";
import Image from "next/image";

interface PopupProps {
  setChannel: () => void;
}

const Popup: React.FC<PopupProps> = ({ setChannel }) => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000]/50 z-50 flex justify-center items-center font-inter">
        <div className="bg-[#311150]/80 w-[600px] h-[300px] rounded-md">
          <div className="flex justify-center items-center p-3">
            <h1 className="text-white text-lg">New Channel</h1>
          </div>
          <div className="flex justify-center items-center my-2 ">
            <input
              type="text"
              className="w-2/3 h-[40px] rounded-md bg-[#D9D9D9] outline-none px-2"
              placeholder="Channel name Ex: #mychannel"
            />
            <div>
                <Image
                    src="/newChannel.svg"
                    alt="add channel"
                    width={25}
                    height={24}
                    priority={true}
                    className="w-8 h-8 object-cover"/>
            </div>
          </div>
          <div className="flex justify-center items-center mt-4">
            <button className="bg-[#811B77] w-[100px] h-[40px] rounded-md text-white hover:bg-[#811B77]/100">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Popup;
