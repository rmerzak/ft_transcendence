"use client";
import Image from "next/image";
import Link from "next/link";
import Popup from "./popup";
import { useState } from "react";

const channels = [
  { name: "General", avatar: "/channelssetting" },
  { name: "Random", avatar: "/channelssetting" },
  { name: "Games", avatar: "/channelssetting" },
  { name: "Music", avatar: "/channelssetting" },
  { name: "Movies", avatar: "/channelssetting" },
  { name: "Sports", avatar: "/channelssetting" },
  { name: "News", avatar: "/channelssetting" },
  { name: "Politics", avatar: "/channelssetting" },
  { name: "Science", avatar: "/channelssetting" },
  { name: "Technology", avatar: "/channelssetting" },
];
const Channels = () => {
  const [newChannel, setNewChannel] = useState<boolean>(false);
  function handleNewChannel() {
    setNewChannel(!newChannel);
  }
  return (
    <div className="">
      <div className="mt-6">
        <h1 className="text-white text-xl text-center">Channels</h1>
        <div className="flex justify-center mt-2">
          <div className="mb-4 border-b border-white w-20"></div>
        </div>
      </div>

      <div className="rounded-md w-3/4 mx-auto mt-2 scroll-y-auto max-h-[300px]">
        {channels.map((channel) => (
          <div
            key={channel.name}
            className="flex bg-[#811B77]/50 justify-between items-center p-3 my-[10px] rounded-md text-white hover:bg-[#811B77]/100"
          >
            <p>#{channel.name}</p>
            <Link href="#">
              <Image
                src="/link.svg"
                alt={channel.name}
                width={25}
                height={24}
                priority={true}
                className="w-5 h-5 object-cover"
              />
            </Link>
          </div>
        ))}
      </div>
        <div className="my-4 flex justify-center items-center">
          <button onClick={handleNewChannel}>
            <Image
              src="/plus.svg"
              alt="add channel"
              width={25}
              height={24}
              priority={true}
              className="w-10 h-10 object-cover"
            />
          </button>
        </div>
      {newChannel && <Popup setChannel={handleNewChannel}/>}
    </div>
  );
};
export default Channels;
