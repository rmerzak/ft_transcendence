"use client";
import Image from "next/image";
import Popup from "./popup";
import { use, useContext, useEffect, useState } from "react";
import { ContextGlobal } from "@/context/contex";
import { ChatRoom } from "@/interfaces";

interface Channel {
  header: string;
}

const Channels: React.FC<Channel> = ({ header }) => {
  const [channels, setChannels] = useState<ChatRoom[]>([]);
  const { chatRoomsJoined, chatRoomsToJoin } = useContext(ContextGlobal);
  const [newChannel, setNewChannel] = useState<boolean>(false);

  function handleNewChannel() {
    setNewChannel(!newChannel);
  }

  useEffect(() => {
    setChannels([...chatRoomsJoined, ...chatRoomsToJoin])
    console.log("channels", chatRoomsJoined, chatRoomsToJoin)
  }, [chatRoomsJoined, chatRoomsToJoin]);
  return (
    <>
      <div className="mt-6">
        <h1 className="text-white md:text-xl text-center">{header}</h1>
        <div className="flex justify-center md:mt-2">
          <div className="md:mb-4 border-b border-white w-16"></div>
        </div>
      </div>

      <div className="rounded-md md:w-3/4 mx-auto mt-2 md:scroll-y-auto md:max-h-[300px]">
        {channels.length > 0 ? channels.map((channel, index) => (
          <div
            key={index}
            className="flex bg-[#811B77]/50 justify-between items-center text-xs md:text-base p-3 my-[6px] md:my-[10px] rounded-md text-white hover:bg-[#811B77]/100"
          >
            <p>#{channel.name}</p>
            <Image
              src={index <= chatRoomsJoined.length && chatRoomsJoined.length > 0 ? "/leave.svg" : "/link.svg"}
              alt={"channel"}
              width={25}
              height={24}
              priority={true}
              draggable={false}
              onClick={() => { alert("Link to channel") }}
              className="w-5 h-5 object-cover"
            />
          </div>
        )): <p className="text-center text-white">No channels</p>}
      </div>
      {
        <div className="my-2 md:my-4 flex justify-center items-center">
          <button onClick={handleNewChannel}>
            <Image
              src="/plus.svg"
              alt="add channel"
              width={25}
              height={24}
              priority={true}
              draggable={false}
              className="h-8 w-8 md:w-10 md:h-10 object-cover"
            />
          </button>
        </div>
      }
      {newChannel && <Popup setChannel={handleNewChannel} />}
    </>
  );
};
export default Channels;
