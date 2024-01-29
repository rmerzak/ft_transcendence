'use client'
import { ContextGlobal } from '@/context/contex';
import React, { useContext } from 'react'
import { Eye } from 'lucide-react';
import LeaderboardEntry from '@/components/LeaderBoard/LeaderBorditem';
import RankEntre from '@/components/LeaderBoard/RankEntre';


const Dashboard = () => {
  const leaderboardData = [
    { rank: 1, avatarSrc: '/mberri.png', smallAvatarSrc: '/Pandora.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 2, avatarSrc: '/rabi.png', smallAvatarSrc: '/commodor.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 3, avatarSrc: '/people-01.png', smallAvatarSrc: '/freax.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 4, avatarSrc: '/people-01.png', smallAvatarSrc: '/Bios.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 5, avatarSrc: '/mberri.png', smallAvatarSrc: '/freax.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 6, avatarSrc: '/people-02.png', smallAvatarSrc: '/Bios.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 7, avatarSrc: '/people-01.png', smallAvatarSrc: '/freax.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 8, avatarSrc: '/people-03.png', smallAvatarSrc: '/Pandora.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 9, avatarSrc: '/people-02.png', smallAvatarSrc: '/freax.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 10, avatarSrc: '/mberri.png', smallAvatarSrc: '/freax.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 11, avatarSrc: '/mberri.png', smallAvatarSrc: '/Bios.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 12, avatarSrc: '/people-01.png', smallAvatarSrc: '/freax.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 13, avatarSrc: '/people-02.png', smallAvatarSrc: '/commodor.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 14, avatarSrc: '/mberri.png', smallAvatarSrc: '/freax.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 15, avatarSrc: '/people-03.png', smallAvatarSrc: '/Pandora.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 16, avatarSrc: '/mberri.png', smallAvatarSrc: '/Bios.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 17, avatarSrc: '/people-02.png', smallAvatarSrc: '/freax.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 18, avatarSrc: '/people-03.png', smallAvatarSrc: '/freax.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 19, avatarSrc: '/rabi.png', smallAvatarSrc: '/commodor.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 20, avatarSrc: '/people-03.png', smallAvatarSrc: '/freax.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 21, avatarSrc: '/mberri.png', smallAvatarSrc: '/Pandora.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
    { rank: 22, avatarSrc: '/people-03.png', smallAvatarSrc: '/Bios.png', username: 'UserGuest123', matchesPlayed: 100, wins: 500, ratio: '50%' },
  ];
  return (
    <div className="bg-profile h-screen m-4 py-4 pl-4 md:pr-0 pr-2 backdrop-blur-md">
     <h1 className="text-white font-bold text-3xl text-center mt-6 mb-8">LeaderBoard</h1>
     <div className='flex flex-row'>
     <div className='w-[70%]'>
        <div className=" w-[99%] mb-3 p-2 text-white font-bold md:text-[15px] text-[10px]  flex justify-between  bg-[#FFFFFF]/30 ml-1 rounded-xl">
          <h1 className=''>Rank</h1>
          <h1>Player</h1>
          <h1>Matches</h1>
          <h1>Wins</h1>
          <h1>Ratio</h1>
          <h1>Profile</h1>
        </div>
        <div className='h-[720px] overflow-auto w-full'>
        {leaderboardData.map((entry, index) => (
          <LeaderboardEntry
            key={index}
            rank={entry.rank}
            avatarSrc={entry.avatarSrc}
            smallAvatarSrc={entry.smallAvatarSrc}
            username={entry.username}
            matchesPlayed={entry.matchesPlayed}
            wins={entry.wins}
            ratio={entry.ratio}
          />
        ))}
        </div>
        </div>
        <RankEntre rank={1} avatarSrcWinner='/mberri.png' avatarSrcSecond='/people-03.png' avatarSrcThird='/rabi.png' bestRank={1}/>
     </div>
    </div>
  )
}

export default Dashboard

