"use client";
import Image from "next/image";
import Popup from "./popup";
import { useContext, useEffect, useState, KeyboardEvent, useRef } from "react";
import { ContextGlobal } from "@/context/contex";
import { ChatRoom, ChatRoomMember } from "@/interfaces";
import { IoIosExit } from "react-icons/io";
import { MdOutlineKey } from "react-icons/md";
import { MdAddLink } from "react-icons/md";
import { getChatRoomsJoined, getChatRoomsNotJoined } from "@/api/chat/chat.api";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import JoinChannel from "./JoinChannel";
import { Plus } from "lucide-react";
import axios from "axios";
import { useDebouncedCallback } from 'use-debounce';
import ChannelItem from "./ChannelItem";

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
  const handleBlur = (e:any) => {
    if (inputRef.current && !inputRef.current.contains(e.relatedTarget)) {
            setSearch('');
    }
};
  const [searched, setSearched] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openChannel, setOpenChannel] = useState<ChatRoom | null>(null);
  const [isPrompetVisible, setIsPrompetVisible] = useState<boolean>(false);
  const [invalue, setinValue] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<ChatRoom | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestedRef =useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState<string>('');
  async function searchProfile(search: string) {
    if (search && !/^[a-zA-Z0-9]+$/.test(search)) {
      return;
    }
    const response = await axios.get(`http://localhost:3000/chat/room/search/${search}`, { withCredentials: true }).then((res) => { setSearched(res.data); console.log(res.data); });
    console.log("searched", searched);
  }
  const debouncedSearchBackend = useDebouncedCallback(searchProfile, 500);

  const handleClick = (ChatRoom: ChatRoom) => {
    setOpen(true);
    setOpenChannel(ChatRoom);
  };
  function HandleOpen() {
    setOpen(!open);
  }

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
    const handleMouseDown: (e: MouseEvent) => void = (e: MouseEvent) => {
      if (suggestedRef.current && !suggestedRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearched([]);
        setSearch('');
      }
    }

    document.addEventListener("mousedown", handleMouseDown);

    return () =>  document.removeEventListener("mousedown", handleMouseDown); }  
    ,[]);

  useEffect(() => {
    if (chatSocket) {
      chatSocket?.on("create-room", (room: ChatRoom) => {
        getChatRoomsNotJoined().then((res) => {
          if (res.data)
            setChatRoomsToJoin(res.data);
        }).catch((err) => { console.log(err) });
      });
      chatSocket?.on("ownedRoom", (room: ChatRoom) => {
        getChatRoomsJoined().then((res) => {
          if (res.data) {
            setChatRoomsJoined(res.data);
            // const newChatRoomsToJoin = chatRoomsToJoin.filter((item: ChatRoom) => item.name !== room.name);
            // setChatRoomsToJoin(newChatRoomsToJoin);
          }
        }).catch((err) => {
          console.log(err);
        });
        getChatRoomsNotJoined().then((res) => {
          if (res.data)
            setChatRoomsToJoin(res.data);
        }).catch((err) => { console.log(err) });
      });
      chatSocket?.on("update_chat_room_member_channel", (roomMem) => {
        if (roomMem) {
          getChatRoomsJoined().then((res) => {
            if (res.data) {
              setChatRoomsJoined(res.data);
            }
          }).catch((err) => { console.log(err); });
          getChatRoomsNotJoined().then((res) => {
            if (res.data)
              setChatRoomsToJoin(res.data);
          }).catch((err) => { console.log(err) });
        }
      });
      chatSocket?.on("update-room_channel", () => {
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
      chatSocket?.on("deletedRoom", (data) => {
        if (data) {
          getChatRoomsJoined().then((res) => {
            if (res.data) {
              setChatRoomsJoined(res.data);
            }
          }).catch((err) => { console.log(err); });
          getChatRoomsNotJoined().then((res) => {
            if (res.data)
              setChatRoomsToJoin(res.data);
          }).catch((err) => { console.log(err) });
        }
      });
      chatSocket?.on("unban_from_room_getData", (data: ChatRoomMember) => {
        if (data)
          getChatRoomsJoined().then((res) => {
            if (res.data) {
              setChatRoomsJoined(res.data);
            }
          }).catch((err) => { console.log(err); });
      });
      chatSocket?.on("error", (data) => {
        if (data) {
          toast.error(data);
        }
      });
    }
    if (search) {
      console.log("search", search);
      debouncedSearchBackend(search);
    }
    return () => {
      chatSocket?.off("create-room");
      chatSocket?.off("ownedRoom");
      chatSocket?.off("error");
      chatSocket?.off("update_chat_room_member_channel");
      chatSocket?.off("update-room_channel");
      chatSocket?.off("deletedRoom");
      chatSocket?.off("unban_from_room_getData");
    };
  }, [chatSocket,search]);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center my-3 mx-auto w-[90%]">
        <div className="flex justify-center">
          <input
            id="channelName"
            type="text"
            className="bg-gray-300 text-black border-none  rounded-l-xl focus:ring-0 h-10 md:w-[70%] focus:outline-none"
            placeholder="channel name"
            onAuxClickCapture={() =>{setOpen(false),setSearched(null),setSearch('')}} onBlur={handleBlur} onMouseDown={() => { setOpen(true); }}
            ref={(input) => { inputRef.current = input; }} onChange={(e) => {setSearch(e.target.value);setOpen(true);}}
          />
          <div className="pr-1 flex items-center justify-center bg-gray-300 text-black rounded-r-xl  md:w-1/7 focus:outline-none ">
            <Search size={24} strokeWidth={2.5} />
          </div>
        </div>
          <div ref={suggestedRef} className="right-1/5 z-10 top-[42px] border-cyan-900 absolute bg-search rounded-b-lg overflow-auto h-[180px]">
            {open && searched.map((room: ChatRoom, index: any) => (
              <div key={index}>
                <ChannelItem channel={room} HandleOpen={HandleOpen} />
              </div>
            ))}
          </div>
      </div>

      <div className="flex flex-col rounded-md md:w-[90%] w-[90%] mx-auto h-[69%]">
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
                            Handlepopup={() => {}}
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
                            Handlepopup={() => {}}
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