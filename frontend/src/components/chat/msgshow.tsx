'use client';
import Image from 'next/image';

const MsgShow = () => {
    return (
        <>
          <div className="bg-[#5D5959]/40 w-[66%] text-white h-[1090px] rounded-3xl p-4 hidden md:block">
          <div>
            <div className="flex">
              <div className="w-full flex justify-center items-center space-x-2">
                <span className="bg-orange-300 rounded-full h-3 w-3"></span>
                <h1 className="text-xl font-thin">User here</h1>
              </div>
              <div className="">
                {/* image messages parrametres */}
                <button>
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zM6 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zM26 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"
                      fill="#ffffff"
                      className=""
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <hr className="w-1/5" />
            </div>
          </div>
          <div className="flex justify-center my-3 h-[89%]">
            <div>msg here</div>
          </div>
          <div className="flex justify-center">
            <hr className="w-1/5" />
          </div>
          {/* input for send derict messages */}
          <div className="flex justify-center items-center space-x-2 my-3">
            <div className="bg-gray-300 w-[6%] h-9 rounded-3xl flex justify-center items-center space-x-4">
              <Image
                src="/folder.svg"
                alt="attach"
                width={20}
                height={20}
                draggable={false}
                className="cursor-pointer"
              />
              <Image
                src="/emoji.svg"
                alt="emoji"
                width={20}
                height={20}
                draggable={false}
                className="cursor-pointer"
              />
            </div>
            <div className=" bg-gray-300 text-black flex justify-center items-center w-[30%] space-x-2 h-9 rounded-3xl font-light">
              <input
                type="text"
                placeholder="Please Be nice in the chat"
                className="w-4/5 focus:outline-none h-full bg-transparent"
              />
              <button>
                <Image
                  src="/send-1.svg"
                  alt="send"
                  width={30}
                  height={30}
                  
                  className="cursor-pointer"
                />
              </button>
            </div>
          </div>
        </div>
        </>
    )};
export default MsgShow;