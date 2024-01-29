"use client";
import Image from "next/image";
import Popup from "./popup";
import { useContext, useEffect, useState, KeyboardEvent } from "react";
import { ContextGlobal } from "@/context/contex";
import { ChatRoom } from "@/interfaces";
import { IoIosExit } from "react-icons/io";
import { MdOutlineKey } from "react-icons/md";
import { MdAddLink } from "react-icons/md";
import { getChatRoomsJoined, getChatRoomsNotJoined } from "@/api/chat/chat.api";
import OutsideClickHandler from "react-outside-click-handler";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import JoinChannel from "./JoinChannel";
import { Plus } from "lucide-react";

interface Channel {
  header: string;
}

const Channels: React.FC<Channel> = ({ header }) => {
  const {
    chatRoomsJoined,
    chatRoomsToJoin,
    setChatRoomsToJoin,
    setChatRoomsJoined,
    chatSocket,
  } = useContext(ContextGlobal);
  const [newChannel, setNewChannel] = useState<boolean>(false);
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [openChannel, setOpenChannel] = useState<ChatRoom | null>(null);
  const [isPrompetVisible, setIsPrompetVisible] = useState<boolean>(false);
  const [invalue, setinValue] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<ChatRoom | null>(null);

  const handleClick = (ChatRoom: ChatRoom) => {
    console.log("User entered:");
    setOpen(true);
    setOpenChannel(ChatRoom);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInput();
    }
  };

  const handleInput = () => {
    console.log("User entered:", invalue);
    setIsPrompetVisible(false);
    chatSocket?.emit("join-channel", invalue);
    setSelectedChannel(null);
    setinValue("");
  };

  function handleJoinRoom(roomId: number) {
    chatSocket?.emit("join-room", { roomId: roomId });
    router.push(`/dashboard/chat/room/${roomId}`);
  }
  function handleNewChannel() {
    setNewChannel(!newChannel);
  }

  useEffect(() => {
    if (chatSocket) {
      chatSocket?.on("create-room", (room: ChatRoom) => {
        getChatRoomsNotJoined().then((res) => {
          if (res.data)
            setChatRoomsToJoin(res.data);
        }).catch((err) => { console.log(err) });
      });
      chatSocket?.on("ownedRoom", (room: ChatRoom) => {
        getChatRoomsJoined()
          .then((res) => {
            if (res.data) {
              setChatRoomsJoined(res.data);
              const newChatRoomsToJoin = chatRoomsToJoin.filter((item: ChatRoom) => item.name !== room.name);
              setChatRoomsToJoin(newChatRoomsToJoin);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
      chatSocket?.on('updated-room', (room: ChatRoom) => {
        // console.log('updated-room', room);
        if (room) {
          getChatRoomsJoined().then((res) => {
            // console.log('joined', res.data);
            if (res.data) {
              setChatRoomsJoined(res.data);
            }
          }).catch((err) => { console.log(err); });
          getChatRoomsNotJoined().then((res) => {
            // console.log('not joined', res.data);
            if (res.data)
              setChatRoomsToJoin(res.data);
          }).catch((err) => { console.log(err) });
        }
      });
      chatSocket?.on("update_chat_room_member", () => {
        getChatRoomsJoined().then((res) => {
          if (res.data) {
            setChatRoomsJoined(res.data);
          }
        }).catch((err) => { console.log(err); });
        getChatRoomsNotJoined().then((res) => {
          if (res.data)
            setChatRoomsToJoin(res.data);
        }).catch((err) => { console.log(err) });
      });
      chatSocket?.on("error", (data) => {
        if (data) {
          toast.error(data);
        }
      });
    }
    return () => {
      chatSocket?.off("create-room");
      chatSocket?.off("ownedRoom");
      chatSocket?.off("error");
      chatSocket?.off("updated-room");
    };
  }, [chatSocket]);
  return (
    <>
      <div className=" my-3 mx-auto w-[90%]">
        <div className="flex justify-center">
          <input
            id="channelName"
            type="text"
            className="bg-gray-300 text-black border-none  rounded-l-xl focus:ring-0 h-10 md:w-[70%] focus:outline-none"
            placeholder="channel name"
          />
          <button className="pr-1 bg-gray-300 text-black rounded-r-xl  md:w-1/7 focus:outline-none ">
            <Search size={24} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-col rounded-md md:w-[90%] w-[90%] mx-auto h-[69%] ">
        <h1 className="mt-3 text-white md:text-xl text-center">
          Joined Channels
        </h1>
        <div className="flex justify-center mt-1">
          <div className="mb-3 border-b border-white w-6 md:w-10"></div>
        </div>

        <div className="h-[330px] overflow-auto">
          {chatRoomsJoined.length > 0 ? (
            chatRoomsJoined.map((channel, index) => (
              <div key={index} className="flex w-full  bg-[#811B77]/50  hover:bg-[#811B77]/100 rounded-xl h-[15%] mb-[9px]">

                <div
                  onClick={() => handleJoinRoom(Number(channel.id))}
                  className=" flex items-center w-full text-xs md:text-base p-3 my-[6px] md:my-[10px] text-white hover:bg-[#811B77]/100"
                >
                  <p>#{channel.name}</p>
                </div>
                <div className="flex items-center">
                  {/* <Mail
                    size={24}
                    strokeWidth={2.5}
                    onClick={() => handleJoinRoom(Number(channel.id))}
                  /> */}
                  <IoIosExit
                    size={28}
                    strokeWidth={2.5}
                    className="pr-1 text-white md:h-[70%] h-[78%]   md:w-1/7 focus:outline-none  hover:bg-[#811B77]/100  "
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-white">No channels</p>
          )}
        </div>

        <h1 className="mt-3 text-white md:text-xl text-center">
          channels to join
        </h1>
        <div className="flex justify-center mt-1">
          <div className="mb-3 border-b border-white w-6 md:w-10"></div>
        </div>

        <div className="flex text-center justify-center mb-1 relative">
          <div className="group flex items-center justify-center">
            <button onClick={handleNewChannel}>
              <Plus size={24} strokeWidth={2} className="text-white font-inter" />
            </button>
            <div
              className={`absolute right-28 -top-4 rounded-md px-2 py-1  bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-10`}
            >
              new channel
            </div>
          </div>
        </div>

        <div className="h-[180px] overflow-auto ">
          {chatRoomsToJoin.length > 0 ? (
            chatRoomsToJoin.map((channel, index) => (
              <div
                key={index}
                className="flex  bg-[#811B77]/50 justify-between items-center text-xs md:text-base p-3 my-[6px] md:my-[10px] rounded-md text-white hover:bg-[#811B77]/100"
              >
                <p>#{channel.name}</p>
                <div className="flex">
                  {channel.visibility === "PROTECTED" &&
                    selectedChannel?.id !== channel.id && (
                      <OutsideClickHandler
                        onOutsideClick={() => {
                          setSelectedChannel(null);
                          setinValue("");
                        }}
                      >
                        <button onClick={() => handleClick(channel)}>
                          {" "}
                          <MdOutlineKey className=" w-[25px] h-[25px]" />{" "}
                        </button>
                        {openChannel === channel && (
                          <JoinChannel
                            channel={channel}
                            setOpenChannel={setOpenChannel}
                          />
                        )}
                      </OutsideClickHandler>
                    )}
                  {isPrompetVisible && selectedChannel?.id === channel.id && (
                    <input
                      type="text"
                      autoFocus
                      placeholder="Enter password"
                      value={invalue}
                      onChange={(e) => setinValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e)}
                      className="text-black rounded-full w-[100%] ml-1"
                    />
                  )}
                  {channel.visibility === "PUBLIC" && (
                    <div>
                      <OutsideClickHandler
                        onOutsideClick={() => {
                          setSelectedChannel(null);
                          setinValue("");
                        }}
                      >
                        <button onClick={() => handleClick(channel)}>
                          {" "}
                          <MdAddLink className=" w-[25px] h-[25px]" />{" "}
                        </button>
                        {openChannel === channel && (
                          <JoinChannel
                            channel={channel}
                            setOpenChannel={setOpenChannel}
                          />
                        )}
                      </OutsideClickHandler>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-white">No channels</p>
          )}
        </div>
      </div>
      {newChannel && <Popup setChannel={handleNewChannel} />}
    </>
  );
};
export default Channels;
