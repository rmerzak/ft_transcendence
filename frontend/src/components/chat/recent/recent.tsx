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
import { XCircle } from 'lucide-react';


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
      <div className="md:mt-4 -mt-6">
        <h1 className="text-white md:text-xl text-center font-inter">Recent</h1>
        <div className="flex justify-center md:mt-2">
          <div className="md:mb-2 mb-0 border-b border-white md:w-14 w-6"></div>
        </div>
      </div>

      <div className="mx-auto w-[90%] md:scroll-y-auto mb-1 text-white rounded-xl">
        {recents.map((recent) => (
          <div
            onClick={() => { router.push(recent.link.toString()) }}
            key={recent.chatRoomId}
            className="flex justify-between items-center my-[6px] md:my-[10px] rounded-md font-inter  bg-[#5D5959]/50 hover:bg-[#5D5959]/100"
          >
            <div className="flex items-center space-x-2 px-2 pt-1 hover:cursor-pointer w-[95%] h-full">
              <div>
                <div className="flex mb-1">
                  <div className="">
                    <Image
                      src={recent.chatRoom?.users[0]?.image || "/avatar.jpeg"}
                      alt='user image'
                      width={25}
                      height={20}
                      priority={true}
                      draggable={false}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                     <h2 className="text-sm font-inter font-medium opacity-50 relative -left-3">@{recent.chatRoom?.users[0]?.username}</h2>
                  </div>
                  <div className="mt-1">
                    <p>{profile?.id === recent.senderId ? "You" : recent.chatRoom?.users[0]?.username}</p>
                    <p className="text-xs">{recent.lastMessage}</p>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => removeRecent(recent.chatRoomId)}>
            <XCircle size={24} strokeWidth={2.5} className="text-red-500 mx-1"/>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
export default Recent;
