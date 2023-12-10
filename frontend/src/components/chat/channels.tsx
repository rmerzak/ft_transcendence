"use client";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <div className="">
      <div className="mt-6">
        <h1 className="text-white text-xl  text-center">Channels</h1>
        <div className="flex justify-center mt-2">
          <div className="mb-4 border-b border-white w-20"></div>
        </div>
      </div>

      <div className="scroll-y-auto max-h-[200px] rounded-md w-3/4 mx-auto mt-2">
        {channels.map((channel) => (
          <div
            key={channel.name}
            className="flex bg-[#811B77]/50 justify-between items-center p-3 my-[10px] rounded-md text-white"
          >
            <p>#{channel.name}</p>
            <Link href="#">
              <Image
                src="/link.svg"
                alt={channel.name}
                width={25}
                height={24}
                className="w-5 h-5 object-cover"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Channels;
