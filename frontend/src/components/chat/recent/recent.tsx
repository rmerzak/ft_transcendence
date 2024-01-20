"use client";
import { deleteRecentMessage, getChatRoomMembers, getRecentMessages } from "@/api/chat/chat.api";
import { ContextGlobal } from "@/context/contex";
import { ChatRoomUsers, Recent } from "@/interfaces";
import { profile } from "console";
import { get } from "http";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";


const Recent = () => {
  const { profile, chatSocket } = useContext(ContextGlobal);
  const [recents, setRecent] = useState<Recent[]>([]);
  const router = useRouter();


  useEffect(() => {
    getRecentMessages().then((res) => {
      // console.log("res", res);
      setRecent(res.data);
    }).catch((err) => {
      console.log("err", err);
    });
  }, []);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.on('receive-recent', () => {
        getRecentMessages().then((res) => {
          // console.log("res recent", res);
          setRecent(res.data);
        }).catch((err) => {
          console.log("err", err);
        });
      });
    }
  }, [chatSocket]);

  function removeRecent(chatRoomId: number) {
    deleteRecentMessage(chatRoomId).then((res) => {
      console.log("res", res);
      getRecentMessages().then((res) => {
        setRecent(res.data);
      }).catch((err) => {
        console.log("err", err);
      });
    }).catch((err) => {
      console.log("err", err);
    });
  }

  return (
    <>
    <div className="border">

      <div className="md:mt-6">
        <h1 className="text-white md:text-xl text-center font-inter">Recent</h1>
        <div className="flex justify-center md:mt-2">
          <div className="md:mb-4 border-b border-white w-14"></div>
        </div>
      </div>

      <div className="mx-auto md:w-3/4 md:scroll-y-auto md:max-h-[300px] my-2 text-white p-1">
        {recents.map((recent) => (
          <div
            onClick={() => { router.push(recent.link.toString()) }}
            key={recent.chatRoomId}
            className="flex justify-between items-center my-[6px] md:my-[10px] rounded-md font-inter  bg-[#5D5959]/50 hover:bg-[#5D5959]/100"
          >
            <div className="flex items-center space-x-2 px-3 py-1 hover:cursor-pointer w-[95%] h-full md:active:p-[10px]">
              <div>

                <h2 className=" mb-1 text-sm font-inter font-medium opacity-50">@{recent.chatRoom?.users[0]?.username}</h2>
                <div className="flex mb-1">
                  <div className="">
                    <Image
                      src={recent.chatRoom?.users[0]?.image || "/avatar.jpeg"}
                      alt='user image'
                      width={25}
                      height={24}
                      priority={true}
                      draggable={false}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </div>
                  <div className="mx-2">
                    <p>{profile?.id === recent.senderId ? "You" : recent.chatRoom?.users[0]?.username}</p>
                    <p className="text-xs">{recent.lastMessage}</p>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => removeRecent(recent.chatRoomId)} className="w-[8%] md:w-[5%] h-full mx-1">
              {/* <X /> */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};
export default Recent;
