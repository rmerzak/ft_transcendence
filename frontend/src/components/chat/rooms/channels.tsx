"use client";
import Popup from "./popup";
import { useContext, useEffect, useState, KeyboardEvent, useRef } from "react";
import { ContextGlobal } from "@/context/contex";
import { ChatRoom, ChatRoomMember } from "@/interfaces";
import { IoIosExit } from "react-icons/io";
import { getChatRoomsJoined } from "@/api/chat/chat.api";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import axios from "axios";
import { useDebouncedCallback } from 'use-debounce';
import ChannelItem from "./ChannelItem";


const Channels = () => {
  const {
    chatRoomsJoined,
    setChatRoomsJoined,
    chatSocket,
    profile
  } = useContext(ContextGlobal);
  const router = useRouter();
  const handleBlur = (e: any) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.relatedTarget) &&
      !suggestedRef.current?.contains(e.target)
    ) {
      setDisplayChannel(false);
      setSearch('');
    }
  };
  
  const [searched, setSearched] = useState<any>([]);
  const [newChannel, setNewChannel] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const  [displayChannel, setDisplayChannel] = useState<boolean>(false);
  const [openChannel, setOpenChannel] = useState<ChatRoom | null>(null);
  const [isPrompetVisible, setIsPrompetVisible] = useState<boolean>(false);
  const [invalue, setinValue] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<ChatRoom | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestedRef = useRef<HTMLDivElement | null>(null);
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
    // console.log("User entered:");
    setOpen(true);
    setOpenChannel(ChatRoom);
  };

  const handleDisplayChannels = () => {
    setDisplayChannel(!displayChannel);
    setSearch('');
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
    console.log("User entered:", search);
    setIsPrompetVisible(false);
    searchProfile(search);
    setSelectedChannel(null);
    setSearch('');
  };

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

    const handleGlobalClick = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !suggestedRef.current?.contains(e.target as Node)
      ) {
        setDisplayChannel(false);
        setSearch('');
      }
    };

    document.addEventListener("mousedown", handleGlobalClick);

    return () => document.removeEventListener("mousedown", handleGlobalClick);
  }, []);

  useEffect(() => {
    if (chatSocket) {
      chatSocket?.on("ownedRoom", (room: ChatRoom) => {
        getChatRoomsJoined().then((res) => {
          if (res.data) {
            setChatRoomsJoined(res.data);
          }
        }).catch((err) => {
          console.log(err);
        });
      });

      chatSocket?.on('accept-join-room', () => {
        getChatRoomsJoined().then((res) => {
          if (res.data) {
            setChatRoomsJoined(res.data);
          }
        }).catch((err) => { console.log(err); });
      });

      chatSocket?.on("update_chat_room_member_channel", (roomMem) => {
        if (roomMem) {
          getChatRoomsJoined().then((res) => {
            if (res.data) {
              setChatRoomsJoined(res.data);
            }
          }).catch((err) => { console.log(err); });
        }
      });

      chatSocket?.on("update-room_channel", () => {
        getChatRoomsJoined().then((res) => {
          if (res.data) {
            setChatRoomsJoined(res.data);
          }
        }).catch((err) => { console.log(err); });
      });

      chatSocket?.on("deletedRoom", (data) => {
        if (data) {
          getChatRoomsJoined().then((res) => {
            if (res.data) {
              setChatRoomsJoined(res.data);
            }
          }).catch((err) => { console.log(err); });
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
    // if (search) {
    //   console.log("search", search);
    //   debouncedSearchBackend(search);
    // }
    return () => {
      chatSocket?.off("ownedRoom");
      chatSocket?.off("error");
      chatSocket?.off("update_chat_room_member_channel");
      chatSocket?.off("update-room_channel");
      chatSocket?.off("deletedRoom");
      chatSocket?.off("unban_from_room_getData");
      chatSocket?.off('accept-join-room');
    };
  }, [chatSocket, search, profile]);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center my-3 mx-auto w-[90%] border">
        <div className="flex justify-center w-full">
          <input
            id="channelName"
            type="text"
            className="bg-gray-300 text-black border-none  rounded-l-xl focus:ring-0 h-10 w-full  focus:outline-none"
            placeholder="channel name"
            onAuxClickCapture={() => { setOpen(false), setSearched(null), setSearch('') }} onBlur={handleBlur} onMouseDown={() => { setOpen(true); }}
            ref={(input) => { inputRef.current = input; }} onChange={(e) => { setSearch(e.target.value); }}
            value={search}
          />
          <div className="pr-1 flex items-center justify-center bg-gray-300 text-black rounded-r-xl  md:w-1/7 focus:outline-none ">
            <button onClick={handleDisplayChannels}>
            <Search size={24} strokeWidth={2.5}/> </button>
          </div>
        </div>
        {displayChannel && searched.length > 0  && (<div ref={suggestedRef} className="border right-1/5 z-10 top-[42px] border-cyan-900 absolute bg-search rounded-b-lg overflow-auto h-[180px]">
          {open && searched.map((room: ChatRoom, index: any) => (
            <div key={index}>
              <ChannelItem channel={room} HandleOpen={HandleOpen}/>
            </div>
          ))}
        </div>)}
      </div>

      <div className="flex flex-col rounded-md md:w-[90%] w-[90%] mx-auto h-[50%]">
        <h1 className="mt-3 text-white md:text-xl text-center">
          Joined Channels
        </h1>
        <div className="flex justify-center mt-1">
          <div className="mb-3 border-b border-white w-6 md:w-10"></div>
        </div>

        <div className="h-[350px] overflow-auto">
          {chatRoomsJoined.length > 0 ? (
            chatRoomsJoined.map((channel, index) => (
              <div key={index} className="flex w-full  bg-[#811B77]/50  hover:bg-[#811B77]/100 rounded-xl h-[15%] mb-[9px]">

                < button onClick={() => {
                  router.push(`/dashboard/chat/room/${channel.id}`);
                }}
                  className=" flex items-center w-full text-xs md:text-base p-3 my-[6px] md:my-[10px] text-white hover:bg-[#811B77]/100"
                >
                  <p>#{channel.name}</p>
                </button>
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
        <div className="flex justify-center mt-1">
          <div className="mb-3 border-b border-white w-6 md:w-10"></div>
        </div>

        <div className="flex text-center justify-center mb-1 relative border">
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
      </div>
      {newChannel && <Popup setChannel={handleNewChannel} />}
    </>
  );
};
export default Channels;