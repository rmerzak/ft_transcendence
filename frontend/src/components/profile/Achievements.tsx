import { ContextGlobal } from "@/context/contex";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const Achievements = () => {

  const [ ach, setAch ] = useState([]);
  const { profile }: any = useContext(ContextGlobal);
  const profileName = usePathname().split("/")[3];

  const fetchAchievenebts = async (username: string) => {
    // fetch achievements
    try {
      const req = await fetch(`${process.env.API_BASE_URL}/api/achievements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ playerName: username }),
      });
      const data = await req.json();
      setAch(data.achievements);
    } catch { }
  };

  useEffect(() => {
    if (profile.id !== -1) {
      fetchAchievenebts(profileName || profile.username);
    }
  }, [profile.id]);

  const achievements = [
    "00.png",
    "01.png",
    "02.png",
    "03.png",
    "04.png",
    "05.png",
    "06.png",
  ];

  return (
    <div className="flex flex-col  items-center">
      <div className="pb-2 text-gray-400 text-[18px] font-thin w-full flex items-center justify-center pt-4">Achievements</div>
      <div className="border-b border-gray-400 w-[60px] mx-auto mb-4"></div>
      <div className="grid grid-cols-4 gap-4">
        {achievements.map((achievement, index) => (
          <img key={index} draggable={false} src={`/Achievements/${achievement}`} alt={`Achievement ${index + 1}`} className={`rounded-full w-32 ${(index + 1 > ach.length) ? 'opacity-45 blur-[3px]' : ''}`} />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
