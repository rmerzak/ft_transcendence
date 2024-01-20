"use client";
import Image from "next/image";
import Popup from "./popup";
import { use, useContext, useEffect, useState } from "react";
import { ContextGlobal } from "@/context/contex";
import { ChatRoom } from "@/interfaces";
import { IoIosExit } from "react-icons/io";
import { MdOutlineKey } from "react-icons/md";
import { MdAddLink } from "react-icons/md";
import { getChatRoomsJoined, getChatRoomsNotJoined } from "@/api/chat/chat.api";
import OutsideClickHandler from "react-outside-click-handler";
import Swal from "sweetalert2";
import { PlusCircle } from 'lucide-react';
import { toast } from "react-toastify";
import JoinChannel from "./JoinChannel";

interface Channel {
  header: string;
}

const Channels: React.FC<Channel> = ({ header }) => {
  const { chatRoomsJoined, chatRoomsToJoin,setChatRoomsToJoin,setChatRoomsJoined ,chatSocket } = useContext(ContextGlobal);
  const [newChannel, setNewChannel] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openChannel, setOpenChannel] = useState<ChatRoom | null>(null);
  const [isPrompetVisible, setIsPrompetVisible] = useState<boolean>(false);
  const [invalue, setinValue] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<ChatRoom | null>(null);

  const handleClick = (ChatRoom: ChatRoom) => {
    //setIsPrompetVisible(true);
    //setSelectedChannel(ChatRoom);
    // Swal.fire({
    //   title: `Enter Password for: ${ChatRoom.name}`,
    //   input: "password",
    //   inputAttributes: {
    //     autocapitalize: "off"
    //   },
    //   showCancelButton: true,
    //   confirmButtonText: "Join",
    //   showLoaderOnConfirm: true,
    //     customClass: {
    //       popup: 'bg-[#78196F]/50 rounded-[2rem]',
    //       title: 'text-white',
    //       input: 'rounded-full',
    //       confirmButton: 'bg-[#fffff]',
    //       cancelButton: 'bg-white'
    //   },
    //   preConfirm: async (password) => {
    //     try {
    //       chatSocket?.emit("new-member", { name: ChatRoom.name, passwordHash: password });
    //       setChatRoomsToJoin((prev: ChatRoom[]) => prev.filter((item: ChatRoom) => item.name !== ChatRoom.name));
    //     } catch (error) {
    //       console.log(error);
    //       Swal.showValidationMessage(`
    //         Request failed: ${error}
    //       `);
    //     }
    //   },
    //   allowOutsideClick: () => !Swal.isLoading()
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //    console.log(result);
    //   }
    // });
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
        if (res.data)
          setChatRoomsJoined(res.data);
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
      <div className="mt-0 md:mt-4">
        <h1 className="text-white md:text-xl text-center">{header}</h1>
        <div className="flex justify-center my-1">
          <div className="border-b border-white w-14"></div>
        </div>
      </div>
      <div className="flex flex-col rounded-md md:w-[90%] w-[90%] mx-auto h-[60%] mt-4">
      <h1 className="font-bold text-center text-white bg-[green] rounded-2xl w-44% mx-auto p-2">Joined Channels</h1>
        <div className="h-[330px] overflow-auto">
        {chatRoomsJoined.length > 0 ? chatRoomsJoined.map((channel, index) => (
          <div
            key={index}
            className="flex bg-[#811B77]/50 justify-between items-center text-xs md:text-base p-3 my-[6px] md:my-[10px] rounded-md text-white hover:bg-[#811B77]/100"
          >
            <p>#{channel.name}</p>
            <IoIosExit className=" w-[25px] h-[25px]" />
          </div>
        )): <p className="text-center text-white">No channels</p>}
        </div>
        <h1 className="mt-2 font-bold  text-center text-orange-400">channels to join</h1>
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
            {channel.visibility === 'PUBLIC' && <MdAddLink className=" w-[25px] h-[25px]"/>}
            </div>
          </div>
        )): <p className="text-center text-white">No channels</p>}
        </div>
      
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
