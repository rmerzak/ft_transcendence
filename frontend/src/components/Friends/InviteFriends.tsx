"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from "next/image";
import 'swiper/css';
import 'swiper/css/navigation';


// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import { Navigation } from "swiper/modules";


const InviteFriends = () => {


const PictureComponent = ({ picture, index }) => {
  return (
    <div key={index}>
      <img src={picture} alt={`Friend ${index + 1}`} className="w-[120px]" />
    </div>
  );
};

  const users = [
    { name: "John Doe", avatar: "https://i.pravatar.cc/300" },
    { name: "Jane Doe", avatar: "https://i.pravatar.cc/301" },
    { name: "Bob Smith", avatar: "https://i.pravatar.cc/302" },
    { name: "Alice Johnson", avatar: "https://i.pravatar.cc/303" },
    { name: "Kate Williams", avatar: "https://i.pravatar.cc/304" },
    { name: "Mike Brown", avatar: "https://i.pravatar.cc/305" },
    { name: "John Doe", avatar: "https://i.pravatar.cc/300" },
    { name: "Jane Doe", avatar: "https://i.pravatar.cc/301" },
    { name: "Bob Smith", avatar: "https://i.pravatar.cc/302" },
    { name: "Alice Johnson", avatar: "https://i.pravatar.cc/303" },
    { name: "Kate Williams", avatar: "https://i.pravatar.cc/304" },
    { name: "Mike Brown", avatar: "https://i.pravatar.cc/305" },
    { name: "John Doe", avatar: "https://i.pravatar.cc/300" },
    { name: "Jane Doe", avatar: "https://i.pravatar.cc/301" },
    { name: "Bob Smith", avatar: "https://i.pravatar.cc/302" },
    { name: "Alice Johnson", avatar: "https://i.pravatar.cc/303" },
    { name: "Kate Williams", avatar: "https://i.pravatar.cc/304" },
    { name: "Mike Brown", avatar: "https://i.pravatar.cc/305" },
    { name: "John Doe", avatar: "https://i.pravatar.cc/300" },
    { name: "Jane Doe", avatar: "https://i.pravatar.cc/301" },
    { name: "Bob Smith", avatar: "https://i.pravatar.cc/302" },
    { name: "Alice Johnson", avatar: "https://i.pravatar.cc/303" },
    { name: "Kate Williams", avatar: "https://i.pravatar.cc/304" },
    { name: "Mike Brown", avatar: "https://i.pravatar.cc/305" },
    { name: "John Doe", avatar: "https://i.pravatar.cc/300" },
    { name: "Jane Doe", avatar: "https://i.pravatar.cc/301" },
    { name: "Bob Smith", avatar: "https://i.pravatar.cc/302" },
    { name: "Alice Johnson", avatar: "https://i.pravatar.cc/303" },
    { name: "Kate Williams", avatar: "https://i.pravatar.cc/304" },
    { name: "Mike Brown", avatar: "https://i.pravatar.cc/305" },
  ];
  
const [nickname, setNickname] = useState("");

const handleNicknameChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setNickname(e.target.value);
  };
  const handleInviteClick = () => {
    // Perform actions when the invite button is clicked, using the entered nickname (stored in the 'nickname' state)
    console.log(`Inviting friends with nickname: ${nickname}`);
    setNickname("");
  };
    return (
        <div  className="text-gray-400 pb-6 bg-achievements md:w-[42%] h-full ">
          <div className="pb-1 text-gray-300 text-[15px] font-thin w-full flex items-center justify-center pt-2">Invite Friends</div>
            <div className="border-b border-gray-200 w-[50px] mx-auto mb-7"></div>
        <div className="flex justify-center text-gray-200">
        <input
          type="text"
          placeholder="Enter nickname"
          value={nickname}
          onChange={handleNicknameChange}
          className="bg-achievements1 mb-4 w-[80%] placeholder-gray-400"
        />
        </div>
        <div className="flex justify-center text-gray-300 mb-6">
            <button onClick={handleInviteClick} className="bg-achievements2 w-[26%] py-1 border">
            invite</button>
        </div>
        <div className="pb-1 text-gray-300 text-[16px] font-thin w-full flex items-center justify-center pt-2">Friends Requests</div>
            <div className="border-b border-gray-200 w-[60px] mx-auto mb-7"></div>
        <div className="grid grid-cols-3 gap-4 border w-[80%] mx-auto">
        {users.map((user, index) => (
          <div key={index}>
             <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                priority={true}
                className="bg-gray-300"
              />
          </div>
        ))}
        </div>
        </div>
    )
}

export default InviteFriends

/*<div className="flex justify-between text-gray-200 ">
        <Swiper  slidesPerView={'auto'}
        spaceBetween={20}
        modules={[Navigation]}
        className="mySwiper">
        {users.map((user, index) => (
          <SwiperSlide key={index}>
             <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                priority={true}
                className="bg-gray-300"
              />
          </SwiperSlide>
        ))}
      </Swiper>

*/