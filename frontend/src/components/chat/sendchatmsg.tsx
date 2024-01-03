'user client'
import React from 'react'
import Image from 'next/image';

const Sendchatmsg = () => {
    return (
        <>
            {/* end message here */}
            <div className="flex justify-center">
                <hr className="w-1/5" />
            </div>
            {/* input for send derict messages */}
            <div className="flex justify-center items-center space-x-2 my-3">
                <div className="bg-gray-300 w-[6%] h-10 rounded-3xl flex justify-center items-center space-x-4">
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
                        className="cursor-pointer h-5 w-5"
                    />
                </div>
                <div className=" bg-gray-300 text-black flex justify-center items-center w-[30%] space-x-2 h-10 rounded-3xl font-light">
                    <input
                        type="text"
                        placeholder="Please Be nice in the chat"
                        className="w-4/5 h-full bg-transparent border-none focus:ring-0"
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
        </>
    );
};

export default Sendchatmsg;