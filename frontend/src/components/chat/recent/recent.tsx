"use client";
import { getRecentMessages } from "@/api/chat/chat.api";
import { ContextGlobal } from "@/context/contex";
import { Recent } from "@/interfaces";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Recent = () => {
  const { chatSocket } = useContext(ContextGlobal);
  const [recents, setRecent] = useState<Recent[]>([]);
  const router = useRouter();

  useEffect(() => {
    getRecentMessages().then((res) => {
      setRecent(res.data);
    }).catch((err) => {
      console.log("err", err);
    });
  }, []);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.on('receive-recent', () => {
        getRecentMessages().then((res) => {
          setRecent(res.data);
        }).catch((err) => {
          console.log("err", err);
        });
      });
    }
  }, [chatSocket]);

  return (
    <>
      <div className="md:mt-6">
        <h1 className="text-white md:text-xl text-center font-inter">Recent</h1>
        <div className="flex justify-center md:mt-2">
          <div className="md:mb-4 border-b border-white w-14"></div>
        </div>
      </div>

      <div className="mx-auto md:w-3/4 md:scroll-y-auto md:max-h-[300px] my-2 text-white">
        {recents.map((recent) => (
          <div
            onClick={() => { router.push(recent.link.toString()) }}
            key={recent.chatRoomId}
            className="flex justify-between items-center my-[6px] md:my-[10px] rounded-md font-inter bg-[#5D5959]/50 hover:bg-[#5D5959]/100"
          >
            <div className="flex items-center space-x-2 p-3 hover:cursor-pointer w-[95%] h-full md:active:p-[10px]">
              <div>
                <h2 className="pb-2 mb-1 text-sm font-inter font-medium opacity-50">@anas</h2>
                <Image
                  src={recent.recentUser.image}
                  alt={recent.recentUser.username}
                  width={25}
                  height={24}
                  priority={true}
                  draggable={false}
                  className="w-10 h-10 object-cover rounded-full"
                />
              </div>
              <div className="">
                <p>{recent.recentUser.username}</p>
                <p className="text-xs">{recent.lastMessage}</p>
              </div>
            </div>
            <button className="w-[8%] md:w-[5%] h-full mx-1">
              <Image
                src="/delete.svg"
                alt={recent.recentUser.username}
                width={25}
                height={24}
                priority={true}
                draggable={false}
                className="w-5 h-5 object-cover"
              />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
export default Recent;
