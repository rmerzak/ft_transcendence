'use client'
import { ContextGlobal } from '@/context/contex';
import React, { use, useContext, useEffect, useState } from 'react'
import { Eye } from 'lucide-react';
import LeaderboardEntry from '@/components/LeaderBoard/LeaderBorditem';
import RankEntre from '@/components/LeaderBoard/RankEntre';
import Loading from '@/components/game/Loading';

type LesderboardEntry = {
  gameElo: number;
  gameMatches: number;
  gameRank: number;
  gameWins: number;
  id: number;
  image: string;
  username: string;
}

const Dashboard = () => {

  const { profile }: any = useContext(ContextGlobal);
  const [leaderboardData, setLeaderboardData] = useState<LesderboardEntry[]>([]);
  const [rank, setRank] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      // use fetch
      const res = await fetch(`${process.env.API_BASE_URL}/api/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await res.json();
      setLeaderboardData(data.leaderboard);
      data.leaderboard.forEach((entry: LesderboardEntry) => {
        if (entry.id === profile.id) {
          setRank(entry.gameRank);
        }
      });
    } catch {}
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (profile.id !== -1) {
      fetchLeaderboardData();
    }
  }, [profile.id]);

  return (
    <div className="bg-profile h-screen m-4 py-4 pl-4 md:pr-0 pr-2 backdrop-blur-md">
      <Loading isLoading={loading} />
     <h1 className="text-white font-bold text-3xl text-center mt-6 mb-8">LeaderBoard</h1>
     <div className='flex flex-row'>
     <div className='w-[70%]'>
        <div className=" w-[99%] mb-3 p-2 text-white font-bold md:text-[15px] text-[10px]  flex justify-between  bg-[#FFFFFF]/30 ml-1 rounded-xl">
          <h1 className=''>Rank</h1>
          <h1>Player</h1>
          <h1>Matches</h1>
          <h1>Wins</h1>
          <h1>Score</h1>
          <h1>Profile</h1>
        </div>
        <div className='h-[720px] overflow-auto w-full'>
        {leaderboardData.map((entry, index) => (
          <LeaderboardEntry
            key={index}
            rank={entry.gameRank}
            avatarSrc={entry.image}
            smallAvatarSrc="/Pandora.png"
            username={entry.username}
            matchesPlayed={entry.gameMatches}
            wins={entry.gameWins}
            score={entry.gameElo}
            profile={entry.username}
          />
        ))}
        </div>
        </div>
        {/* <RankEntre rank={rank} avatarSrcWinner={!loading ? leaderboardData[0].image : ''} avatarSrcSecond={!loading ? leaderboardData[1].image : ''} avatarSrcThird='/rabi.png' bestRank={1}/> */}
     </div>
    </div>
  )
}

export default Dashboard

