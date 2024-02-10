'use client'
import { ContextGlobal } from '@/context/contex';
import React, { useContext, useEffect, useState } from 'react'
import LeaderboardEntry from '@/components/LeaderBoard/LeaderBorditem';
import RankEntre from '@/components/LeaderBoard/RankEntre';
import Loading from '@/components/game/Loading';
import PlayPopup from '@/components/game/PlayPopup';

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
  const [leaderboardData, setLeaderboardData] = useState<LesderboardEntry[]>([
    {
      gameElo: 0,
      gameMatches: 0,
      gameRank: 0,
      gameWins: 0,
      id: 0,
      image: '/avatar.jpeg',
      username: 'username',
    },
  ]);
  const [rank, setRank] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [openAl, setOpenAl] = useState<boolean>(false);

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
  }, [profile.id, leaderboardData?.length]);
  
  return (
    <>
      { openAl && <PlayPopup openAl={() => setOpenAl(!openAl)} />}
    <div className="bg-profile h-screen m-4 py-4 pl-4 md:pr-0 pr-2 backdrop-blur-md">
      <Loading isLoading={loading} />
     <h1 className="text-white font-bold text-3xl text-center mt-6 mb-8">LeaderBoard</h1>
     <div className='flex flex-row'>
     <div className='w-[70%]'>
        {leaderboardData.length > 0 && <div className=" w-[99%] mb-3 p-2 text-white font-bold md:text-[15px] text-[10px]  flex justify-between  bg-[#FFFFFF]/30 ml-1 rounded-xl">
          <h1 className=''>Rank</h1>
          <h1>Player</h1>
          <h1>Matches</h1>
          <h1>Wins</h1>
          <h1>Score</h1>
          <h1>Profile</h1>
        </div>}
        <div className='h-[720px] overflow-auto w-full'>
        {leaderboardData.length > 0 ? leaderboardData.map((entry, index) => (
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
        )) : 
        <div className='flex flex-col justify-center items-center'>
          <h1 className='text-white font-inter text-center mt-5 text-3xl'>No player is registered in the leaderboard</h1>
          <h2 className='text-white font-inter text-center mt-5 text-3xl'><span className='text-[#BC51BE] text-bold'>Play</span> and you'll be here</h2>
          <button onClick={() => setOpenAl(!openAl)} className='btn mt-5 w-20 text-white bg-[#BC51BE]/50'>
            Play
          </button>
        </div>
        }
        </div>
        </div>
        <RankEntre
          rank={rank}
          avatarSrcWinner={leaderboardData.length > 0 ? leaderboardData[0].image : '/avatar.jpeg'}
          avatarSrcSecond={leaderboardData.length > 1 ? leaderboardData[1].image : '/avatar.jpeg'}
          avatarSrcThird={leaderboardData.length > 2 ? leaderboardData[2].image : '/avatar.jpeg'}
          bestRank={1}
        />
     </div>
    </div>
    </>
  )
}

export default Dashboard

