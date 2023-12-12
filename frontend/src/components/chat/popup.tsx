import React from "react";
import './userOnline.css';

interface PopupProps {
  setChannel: () => void;
}

const Popup: React.FC<PopupProps> = ({ setChannel }) => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000]/50 z-50 flex justify-center items-center font-inter">
        <div className="bg-[#311150]/80 w-[550px] h-[300px] rounded-md shadow-lg font-light">
          <div className="flex justify-center items-center p-3">
            <h1 className="text-white text-lg">New Channel</h1>
          </div>
          <div className="flex justify-center items-center my-2 w-3/4 mx-auto">
            <div className="w-[90%] h-full flex justify-center items-center bg-[#D9D9D9] rounded-lg">
              <input
                type="text"
                className="w-[90%] h-11 rounded-l-lg bg-[#D9D9D9] outline-none px-2 text-lg"
                placeholder="Channel name Ex: #mychannel"
              />
              <div className="w-[10%]">
                <svg
                  className="w-6 h-6 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 19"
                >
                  <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z" />
                  <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center my-2">
            <input type="password" name="" id="" className="w-[67.5%] bg-[#D9D9D9] h-11 rounded-lg px-2 text-lg outline-none" placeholder="group password" />
          </div>
          <div className="text-white font-light text-lg flex justify-center items-center space-x-1 my-3">
            <fieldset className="flex justify-between items-center space-x-4 w-[67.5%] h-10 p-2" id="safe">
              <div className="space-x-1 flex justify-center items-center">
                <input type="radio" name="safe" id="private" className="form-radio text-red-500 focus:ring-red-500" defaultChecked />
                <label htmlFor="private">public</label>
              </div>
              <div className="space-x-1 flex justify-center items-center">
                <input type="radio" name="safe" id="private"/>
                <label htmlFor="private">private</label>
              </div>
              <div className="space-x-1 flex justify-center items-center">
                <input type="radio" name="safe" id="private"/>
                <label htmlFor="private">protected</label>
              </div>
            </fieldset>
          </div>
          <div className="flex justify-center items-center mt-4 text-sm">
            <div className="flex justify-between w-[67.5%]">
            <button onClick={setChannel} className="w-[100px] h-[40px] rounded-xl text-white hover:bg-[#811B77]/100 border">
              Cancel
            </button>
            <button className="bg-[#811B77] w-[100px] h-[40px] rounded-xl text-white hover:bg-[#811B77]/100 border">
              New
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Popup;
