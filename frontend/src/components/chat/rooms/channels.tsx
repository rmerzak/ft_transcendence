"use client";
import Image from "next/image";
import Popup from "./popup";
import { useContext, useEffect, useState } from "react";
import { ContextGlobal } from "@/context/contex";
import { ChatRoom } from "@/interfaces";
import { IoIosExit } from "react-icons/io";
import { MdOutlineKey } from "react-icons/md";
import { MdAddLink } from "react-icons/md";
import { getChatRoomsJoined, getChatRoomsNotJoined } from "@/api/chat/chat.api";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Channel {
  header: string;
}

const Channels: React.FC<Channel> = ({ header }) => {
  const { chatRoomsJoined, chatRoomsToJoin,setChatRoomsToJoin,setChatRoomsJoined ,chatSocket } = useContext(ContextGlobal);
  const [newChannel, setNewChannel] = useState<boolean>(false);
  const router = useRouter();

  function handleJoinRoom(roomId: number) {
    chatSocket?.emit("join-room", { roomId: roomId });
    router.push(`/dashboard/chat/room/${roomId}`);
  }
  function handleNewChannel() {
    setNewChannel(!newChannel);
  }

  useEffect(() => {
    chatSocket?.on("create-room", (room: ChatRoom) => {
      // console.log("create-room", room);
      getChatRoomsNotJoined().then((res) => {
        if (res.data)
          setChatRoomsToJoin(res.data);
      }).catch((err) => { console.log(err) });
    });
    chatSocket?.on("ownedRoom", (room: ChatRoom) => {
      getChatRoomsJoined().then((res) => {
        if (res.data)
          setChatRoomsJoined(res.data);
      }).catch((err) => { console.log(err) });
    });
    // console.log("chatRoomsJoined");
  }, [chatSocket]);
  return (
    <>
      <div className="mt-6">
        <h1 className="text-white md:text-xl text-center">{header}</h1>
        <div className="flex justify-center md:mt-2">
          <div className="md:mb-4 border-b border-white w-16"></div>
        </div>
      </div>

      <div className="rounded-md md:w-3/4 mx-auto mt-2 md:scroll-y-auto md:max-h-[300px]">
        {chatRoomsJoined.length > 0 ? chatRoomsJoined.map((channel, index) => (
          <div 
            key={index}
            className="flex bg-[#811B77]/50 justify-between items-center text-xs md:text-base p-3 my-[6px] md:my-[10px] rounded-md text-white hover:bg-[#811B77]/100"
          >
            <p>#{channel.name}</p>
            <div className="flex">
            <MessageCircle onClick={() => handleJoinRoom(Number(channel.id))} />
            <IoIosExit className=" w-[25px] h-[25px]" />
            </div>
          </div>
        )): <p className="text-center text-white">No channels</p>}
        {chatRoomsToJoin.length > 0 ? chatRoomsToJoin.map((channel, index) => (
          <div
            key={index}
            className="flex bg-[#811B77]/50 justify-between items-center text-xs md:text-base p-3 my-[6px] md:my-[10px] rounded-md text-white hover:bg-[#811B77]/100"
          >
            <p>#{channel.name}</p>
            <div className="flex">
            {channel.visibility === 'PROTECTED' &&  <MdOutlineKey className=" w-[25px] h-[25px]"/>}
            {channel.visibility === 'PUBLIC' && <MdAddLink className=" w-[25px] h-[25px]"/>}
            </div>
          </div>
        )): <p className="text-center text-white">No channels</p>}
      </div>
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
      
      {newChannel && <Popup setChannel={handleNewChannel} />}
    </>
  );
};
export default Channels;
