"use client";
import {
  deleteRecentMessage,
  getChatRoomMembers,
  getRecentMessages,
} from "@/api/chat/chat.api";
import { ContextGlobal } from "@/context/contex";
import { ChatRoom, Recent } from "@/interfaces";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useContext, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type RecentProps = {
  rooms?: ChatRoom[];
};

const isNumber = (value: string | number | undefined): boolean => {
  if (value === undefined) return false;
  return !isNaN(Number(value.toString()));
};
const Recent: React.FC<RecentProps> = ({ rooms }) => {
  const { profile, chatSocket } = useContext(ContextGlobal);
  const [recents, setRecent] = useState<Recent[]>([]);
  const router = useRouter();

  useEffect(() => {
    getRecentMessages().then((res) => {
      if (res.data && res.data.length > 0) {
        setRecent(res.data);
      }
    }).catch((err) => {
      console.error(err);
    });
  }, []);

  useEffect(() => {
    if (rooms) {
      rooms.forEach((room) => {
        // console.log("room id", room);
        isNumber(room.id) ? chatSocket?.emit('join-room', { roomId: room.id }) : null;
      });
    }
  }, [rooms]);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.on('receive-recent', () => {
        getRecentMessages().then((res) => {
          if (res.data)
            setRecent(res.data);
        }).catch((err) => {
          console.error(err);
        });
      });
    }
    return () => {
      chatSocket?.off('receive-recent');
    }
  }, [chatSocket]);

  function removeRecent(chatRoomId: number) {
    deleteRecentMessage(chatRoomId).then((res) => {
      if (res.data) {
        getRecentMessages().then((res) => {
          if (res.data)
            setRecent(res.data);
        }).catch((err) => {
          console.error(err);
        });
      }
    })
      .catch((err) => {
        console.error(err);
      });
  }
  return (
    <>
      <div className="-mt-10">
        <h1 className="text-white md:text-xl text-center font-inter">Recent</h1>
        <div className="flex justify-center md:mt-2">
          <div className="md:mb-2 mb-0 border-b border-white md:w-14 w-6"></div>
        </div>
      </div>

      <div className="mx-auto w-[90%] md:scroll-y-auto mb-1 text-white rounded-xl">
        {recents.map((recent) => (
          isNumber(recent.chatRoomId) &&
          <div
            key={recent.chatRoomId}
            className="flex justify-between items-center my-[6px] md:my-[10px] rounded-md font-inter  bg-[#5D5959]/50 hover:bg-[#5D5959]/100"
          >
            <div
              onClick={() => {
                router.push(recent.link.toString());
              }}
              className="flex items-center space-x-2 px-2 pt-1 hover:cursor-pointer w-[95%] h-full"
            >
              <div className="flex justify-between">
                <div className="flex mb-1">
                  <div className="">
                    <Image
                      src={recent.chatRoom?.users[0]?.image || "/avatar.jpeg"}
                      alt="user image"
                      width={25}
                      height={20}
                      priority={true}
                      draggable={false}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <h2 className="text-sm font-inter font-medium opacity-50 relative -left-2 ">
                      @{recent.chatRoom?.users[0]?.username}
                    </h2>
                  </div>
                  <div className="m-1">
                    <p>
                      {profile?.id === recent.senderId
                        ? "You"
                        : recent.chatRoom?.users[0]?.username}
                    </p>
                    <p className="text-xs">{recent.lastMessage}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button onClick={() => removeRecent(recent.chatRoomId)}>
                <Trash2
                  size={24}
                  strokeWidth={1.5}
                  className="text-white mx-2 hover:cursor-pointer"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default Recent;

