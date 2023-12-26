'use client'
import ProfileInformation from "@/components/profile/ProfileInformation"
import MatchHistory from "@/components/profile/MatchHistory"
import Achievements from "@/components/profile/Achievements"
import Statistics from "@/components/profile/Statistics"
import { data } from "@/data/MatchHistory"
import { useContext } from "react"
import { ContextGlobal } from "@/context/contex"
import { useEffect } from "react"
import { getUserInfo } from "@/api/user/user"
import { User } from "@/interfaces"
import { useParams } from "next/navigation"

const Profile = () => {
  const { profile }:User = useContext(ContextGlobal);

  const BtnFriend = false;
  return (
    <>
    {/* <div>
      <div className="h-[200px]">
      </div>
      <MatchHistory />

    </div> */}
    <div className="p-4 mx-2 bg-profile">
      <h1 className="text-white font-bold text-3xl text-center mb-3">Profile</h1>
      <div className=" w-full h-[250px] border-spacing-1 mb-3 border-[#ffff]">
       <ProfileInformation profile={profile} BtnFriend={BtnFriend} />
      </div>
      <div className="flex md:flex-row flex-col">
        <div className="shadow-2xl pb-6 bg-achievements md:w-[33.33%] w-full h-full backdrop-blur-lg md:mb-0 mb-2">
        <Achievements />
        <Statistics />
        </div>
        <div className="md:w-[66.33%] md:ml-2">
        <MatchHistory data={data} head={["Player","Result","Opponents"]}/>
        </div>
      </div>
    </div>
    </>
  )
}

export default Profile

