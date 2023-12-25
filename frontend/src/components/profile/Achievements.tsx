import React from "react";

const Achievements = () => {
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
    <>
    <div className="pb-2 text-gray-400 text-[18px] font-thin w-full flex items-center justify-center pt-4">Achievements</div>
    <div className="border-b border-gray-400 w-[60px] mx-auto mb-4"></div>
    <div className="grid grid-cols-4 gap-4">
      {achievements.map((achievement, index) => (
        <img key={index} src={`/Achievements/${achievement}`} alt={`Achievement ${index + 1}`} className="rounded-full"/>
      ))}
    </div>
    </>
  );
};

export default Achievements;
