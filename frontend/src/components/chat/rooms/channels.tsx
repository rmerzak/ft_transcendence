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
import OutsideClickHandler from "react-outside-click-handler";
import Swal from "sweetalert2";
import { PlusCircle } from 'lucide-react';
import { Search } from 'lucide-react';

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import JoinChannel from "./JoinChannel";
import { Mail } from 'lucide-react';

interface Channel {
  header: string;
}

const Channels: React.FC<Channel> = ({ header }) => {
  const { chatRoomsJoined, chatRoomsToJoin,setChatRoomsToJoin,setChatRoomsJoined ,chatSocket } = useContext(ContextGlobal);
  const [newChannel, setNewChannel] = useState<boolean>(false);
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [openChannel, setOpenChannel] = useState<ChatRoom | null>(null);
  const [isPrompetVisible, setIsPrompetVisible] = useState<boolean>(false);
  const [invalue, setinValue] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<ChatRoom | null>(null);

  const handleClick = (ChatRoom: ChatRoom) => {
    console.log('User entered:');
    setOpen(true);
    setOpenChannel(ChatRoom)
  }
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      handleInput();
    }
  };


  const handleInput = () => {
    console.log('User entered:', invalue);
    setIsPrompetVisible(false);
    chatSocket?.emit("join-channel", invalue);
    setSelectedChannel(null);
    setinValue('');
  };

  function handleJoinRoom(roomId: number) {
    chatSocket?.emit("join-room", { roomId: roomId });
    router.push(`/dashboard/chat/room/${roomId}`);
  }
  function handleNewChannel() {
    setNewChannel(!newChannel);
  }

  useEffect(() => {
    chatSocket?.on("create-room", (room: ChatRoom) => {
      console.log("create-room", room);
      getChatRoomsNotJoined().then((res) => {
        if (res.data)
          setChatRoomsToJoin(res.data);
      }).catch((err) => { console.log(err) });
      
    });
    chatSocket?.on("ownedRoom", (room: ChatRoom) => {
      getChatRoomsJoined().then((res) => {
        console.log(room);
        if (res.data) {
          setChatRoomsJoined(res.data);
          setChatRoomsToJoin((prev: ChatRoom[]) => prev.filter((item: ChatRoom) => item.name !== room.name));
        }

      }).catch((err) => { console.log(err) });
    });
    
    chatSocket?.on('error', (data) => {
      if(data) {
        toast.error(data);
    }
});
    console.log("chatRoomsJoined");
  }, [chatSocket]);
  return (
    <>
    <div className="flex justify-around my-3 mx-auto w-[90%]">
            <div className="flex">
              <input
                type="text"
                className="bg-gray-300 text-black border-none  rounded-l-xl focus:ring-0 h-10 md:w-3/4 focus:outline-none"
                placeholder="channel name"
              />
              <button className="pr-1 bg-gray-300 text-black rounded-r-xl  md:w-1/7 focus:outline-none " ><Search size={24} strokeWidth={2.5}/></button>
            </div>
          
          <div className="flex text-center">
              <button onClick={handleNewChannel}>
              <PlusCircle size={24} strokeWidth={2.5} className="text-green-400"/>
              </button>
            </div>
        </div>

      <div className="flex flex-col rounded-md md:w-[90%] w-[90%] mx-auto h-[69%] ">
      <h1 className="font-bold text-center text-white bg-[green] rounded-2xl w-44% mx-auto p-2">Joined Channels</h1>
        <div className="h-[330px] overflow-auto">
        {chatRoomsJoined.length > 0 ? chatRoomsJoined.map((channel, index) => (
          <div 
            key={index}
            className="flex bg-[#811B77]/50 justify-between items-center text-xs md:text-base p-3 my-[6px] md:my-[10px] rounded-xl text-white hover:bg-[#811B77]/100"
          >
            <p>#{channel.name}</p>
            <div className="flex">
            <Mail size={24} strokeWidth={2.5} onClick={() => handleJoinRoom(Number(channel.id))} />
            <IoIosExit size={24} strokeWidth={2.5} className=" w-[25px] h-[25px]" />
            </div>
          </div>
        )): <p className="text-center text-white">No channels</p>}
        </div>
        <h1 className="font-bold text-center text-white bg-orange-500 rounded-2xl w-44% mx-auto p-2 mt-4">channels to join</h1>
        <div className="h-[160px] overflow-auto">
        {chatRoomsToJoin.length > 0 ? chatRoomsToJoin.map((channel, index) => (
          <div
            key={index}
            className="flex bg-[#811B77]/50 justify-between items-center text-xs md:text-base p-3 my-[6px] md:my-[10px] rounded-md text-white hover:bg-[#811B77]/100">
            <p>#{channel.name}</p>
            <div className="flex">
            {channel.visibility === 'PROTECTED' && selectedChannel?.id !== channel.id &&
              <OutsideClickHandler onOutsideClick={() => { setSelectedChannel(null); setinValue(''); }}>
                <button onClick={() => handleClick(channel)}> <MdOutlineKey className=" w-[25px] h-[25px]" /> </button>
                {openChannel === channel && <JoinChannel channel={channel} setOpenChannel={setOpenChannel} />}
              </OutsideClickHandler>
            }
            {isPrompetVisible && selectedChannel?.id === channel.id &&<input type="text" autoFocus placeholder="Enter password" value={invalue} onChange={(e) => setinValue(e.target.value)} onKeyDown={handleKeyDown} className="text-black rounded-full w-[100%] ml-1"/>}
            {channel.visibility === 'PUBLIC' && 
            <div>
            
            <OutsideClickHandler onOutsideClick={() => { setSelectedChannel(null); setinValue(''); }}>
                <button onClick={() => handleClick(channel)}> <MdAddLink  className=" w-[25px] h-[25px]"/> </button>
                {openChannel === channel && <JoinChannel channel={channel} setOpenChannel={setOpenChannel} />}
              </OutsideClickHandler>
              </div>
            }
            </div>
          </div>
        )): <p className="text-center text-white">No channels</p>}
        </div>
      
      </div>
      {newChannel && <Popup setChannel={handleNewChannel} />}
    </>
  );
};
export default Channels;
