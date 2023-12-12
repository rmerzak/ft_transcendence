"use client";
import Image from "next/image";

const msg = [
  { name: "user1", avatar: "https://i.pravatar.cc/300", msg: "slam alikom" },
  { name: "user2", avatar: "https://i.pravatar.cc/301", msg: "slam alikom" },
  { name: "user3", avatar: "https://i.pravatar.cc/302", msg: "slam alikom" },
  { name: "user4", avatar: "https://i.pravatar.cc/303", msg: "slam alikom" },
  { name: "user5", avatar: "https://i.pravatar.cc/304", msg: "slam alikom" },
  { name: "user6", avatar: "https://i.pravatar.cc/305", msg: "slam alikom" },
  { name: "user7", avatar: "https://i.pravatar.cc/300", msg: "slam alikom" },
  { name: "user8", avatar: "https://i.pravatar.cc/301", msg: "slam alikom" },
  { name: "user9", avatar: "https://i.pravatar.cc/302", msg: "slam alikom" },
  { name: "user10", avatar: "https://i.pravatar.cc/303", msg: "slam alikom" },
  { name: "user11", avatar: "https://i.pravatar.cc/304", msg: "slam alikom" },
  { name: "user12", avatar: "https://i.pravatar.cc/305", msg: "slam alikom" },
  { name: "user13", avatar: "https://i.pravatar.cc/300", msg: "slam alikom" },
  { name: "user14", avatar: "https://i.pravatar.cc/301", msg: "slam alikom" },
  { name: "user15", avatar: "https://i.pravatar.cc/302", msg: "slam alikom" },
  { name: "user16", avatar: "https://i.pravatar.cc/303", msg: "slam alikom" },
  { name: "user17", avatar: "https://i.pravatar.cc/304", msg: "slam alikom" },
  { name: "user18", avatar: "https://i.pravatar.cc/305", msg: "slam alikom" },
];

const Msg = () => {
  return (
    <div>
      <div className="md:mt-6">
        <h1 className="text-white md:text-xl text-center font-inter">Recent</h1>
        <div className="flex justify-center md:mt-2">
          <div className="md:mb-4 border-b border-white w-14"></div>
        </div>
      </div>

      <div className="mx-auto md:w-3/4 md:scroll-y-auto md:max-h-[300px] my-2 text-white">
        {msg.map((msg) => (
          <div
            key={msg.name}
            className="flex justify-between items-center my-[6px] md:my-[10px] rounded-md font-inter bg-[#5D5959]/50 hover:bg-[#5D5959]/100"
          >
            <div className="flex items-center space-x-3 p-3 hover:cursor-pointer w-[95%] h-full md:active:p-[10px]">
              <Image
                src={msg.avatar}
                alt={msg.name}
                width={25}
                height={24}
                priority={true}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div>
                <p>{msg.name}</p>
                <p className="text-xs">{msg.msg}</p>
              </div>
            </div>
            <button className="w-[8%] md:w-[5%] h-full mx-1">
              <Image
                src="/delete.svg"
                alt={msg.name}
                width={25}
                height={24}
                priority={true}
                className="w-5 h-5 object-cover"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Msg;
