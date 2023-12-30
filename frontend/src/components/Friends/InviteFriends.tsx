"use client";
import React, { useState } from "react";
import Piece from "./piece";
import Image from "next/image";


const InviteFriends = () => {

const [nickname, setNickname] = useState("");

const handleNicknameChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setNickname(e.target.value);
  };
  const handleInviteClick = () => {
    // Perform actions when the invite button is clicked, using the entered nickname (stored in the 'nickname' state)
    console.log(`Inviting friends with nickname: ${nickname}`);
    setNickname("");
  };

  const pictures = [
    '/mberri.png',
    '/people-01.png',
    '/dfpic.png',
    '/people-02.png',
    '/people-03.png',
    '/dfpic.png',
    '/dfpic.png',
    '/people-03.png',
    '/dfpic.png',
    // Add more pictures as needed
  ];

    return (
        <div  className="text-gray-400 pb-6 bg-achievements md:w-[41%] mx-2 md:mt-0 mt-4">
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
        <div className="flex justify-center text-gray-300 mb-4">
            <button onClick={handleInviteClick} className="bg-achievements2 w-[26%] py-1 border">
            invite</button>
        </div>
        <div className="pb-1 text-gray-300 text-[16px] font-thin w-full flex items-center justify-center pt-2">Friends Requests</div>
            <div className="border-b border-gray-200 w-[60px] mx-auto mb-4"></div>
          <div className="overflow-auto h-[250px] space-y-3 flex flex-col items-center">
            {pictures.map((pic, index) => (
              <Piece key={index} picture={pic} check={true}/>
            ))}
          </div>
          <div className="pb-1 text-gray-300 text-[16px] font-thin w-full flex items-center justify-center pt-4">Pending Requests</div>
            <div className="border-b border-gray-200 w-[60px] mx-auto mb-4"></div>
              <div className="overflow-auto h-[140px] space-y-3 flex flex-col items-center">
            {pictures.map((pic, index) => (
              <Piece key={index} picture={pic}  check={false}/>
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