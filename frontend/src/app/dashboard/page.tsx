"use client";
import { useRouter } from "next/navigation";

import { useContext } from "react";
import { ContextGlobal } from "@/context/contex";
import TopPlayer from "@/components/LeaderBoard/TopPlayer";
import Rank from '@/components/LeaderBoard/Rank';

const Dashboard = () => {
  const router = useRouter();
  const { profile }: any = useContext(ContextGlobal);
  const redirectToAnotherPage = () => {
    router.push('/dashboard/game');
};
  return (
    <div className="flex  items-center justify-center   h-screen ">
      <div className="flex items-center justify-center bg-profile  w-[95%] h-[90%] ">
        <div className="w-[95%] h-[90%]">
        <div className="flex justify-center text-white font-bold text-3xl    ">
          <div>LeaderBoard</div>
        </div>
        <>
        <div className="flex justify-center text-white text-5xl "style={{ marginTop: '150px'}} >

        <h1>No player is registered in the leaderboard </h1>
        </div>
        <div className="flex justify-center text-white text-5xl "style={{ marginTop: '100px'}} >
        <h1>Play and you’ll be here </h1>
        </div>
        <div className="flex justify-center text-white text-5xl "style={{ marginTop: '100px'}} >

        <button onClick={redirectToAnotherPage} className="bg-achievements2 w-[26%] py-1 border">
                    Play</button>
        </div>
        </>
        {/* <div className="flex lg:flex-row flex-col w-full h-full ">
          <div className="mt-5 mr-4 lg:w-[70%] text-white ">
            <div className="flex justify-center items-center h-[40px] bg-[#FFFFFF]/15 my-2 rounded-full ">
              <div className="flex justify-between  text-white w-[95%] ">
                <h2>Rank</h2>
                <h2>Player</h2>
                <h2>Matches</h2>
                <h2>Wins</h2>
                <h2>Score</h2>
                <h2>Profile</h2>
              </div>
            </div>
          </div>
              <TopPlayer Rank={1} avatar="ylambark" coalitions="" username="yahya" matchesPlayed={10} wins={6} score={60} eye="" />


        <Rank First="ylambark.png" Second="ylambark.png" Last="ylambark.png" rank={1} Best={5}/>
        </div> */}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;