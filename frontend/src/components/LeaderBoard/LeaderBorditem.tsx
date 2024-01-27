import React from 'react';
import { Eye } from 'lucide-react';

const LeaderboardEntry: React.FC<{
  rank: number;
  avatarSrc: string;
  smallAvatarSrc: string;
  username: string;
  matchesPlayed: number;
  wins: number;
  ratio: string;
}> = ({ rank, avatarSrc, smallAvatarSrc, username, matchesPlayed, wins, ratio }) => {
  return (
    <div className='w-full bg-[#FFFFFF]/10 my-2 rounded-xl py-1  px-2 flex justify-between'>
      <div className='flex items-center'>
        <h1 className='text-white font-bold text-[26px]'> #{rank}</h1>
      </div>
      <div className='flex '>
        <div className='flex flex-col items-center'>
          <div className='relative'>
            <img src={avatarSrc} alt="avatar" className="md:w-[50px] md:h-[50px] w-[30px] h-[32px] rounded-full"/>
            <img src={smallAvatarSrc} alt="avatar" className="absolute top-1/2 -right-1 md:w-[15px] md:h-[25px] w-[10px] h-[15px]" style={{ filter: 'saturate(150%) brightness(120%)' }}/>
          </div>
          <h1 className='text-gray-200 font-thin md:text-[12px] text-[8px]'>{username}</h1>
        </div>
      </div>
      <div className='flex flex-col md:space-y-3 relative md:right-5 right-3'>
        <h1 className='text-white font-semibold  md:text-[16px] text-[12px] flex justify-center'>{matchesPlayed}</h1>
        <h1 className='text-gray-300 font-thin md:text-[12px] text-[9px]'>Matches Played</h1>
      </div>
      <div className='flex flex-col space-y-3 relative md:right-6 right-4'>
        <h1 className='text-white font-semibold md:text-[16px] text-[12px] flex items-top mx-1 '>{wins}</h1>
        <h1 className='text-gray-300 font-thin md:text-[12px] text-[10px] mx-1 flex items-bottom '>Wins</h1>
      </div>
      <div className='flex flex-col space-y-3 relative md:right-5 right-2'>
        <h1 className='text-white font-semibold md:text-[16px] text-[12px] flex items-top mx-1 '>{ratio}</h1>
        <h1 className='text-gray-300 font-thin md:text-[12px] text-[10px] mx-1 flex items-bottom '>Ratio</h1>
      </div>
      <div>
        <button className=' h-full text-white flex items-center md:mr-2 mr-1'> <Eye size={24} strokeWidth={2.5}/></button>
      </div>
    </div>
  );
}

export default LeaderboardEntry;
