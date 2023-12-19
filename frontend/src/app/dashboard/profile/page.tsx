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
const Profile = () => {
  const { profile }:User = useContext(ContextGlobal);
  return (
    <>
    {/* <div>
      <div className="h-[200px]">
      </div>
      <MatchHistory />

    </div> */}
    <div className="py-8 mx-2">
      <div className=" w-full h-[250px] border-spacing-1 mb-3 border-[#ffff]">
       <ProfileInformation profile={profile} btnFriend={false}/>
      </div>
      <div className="flex md:flex-row flex-col">
        <div className="pb-6 bg-achievements w-[33.33%] h-full backdrop-blur-lg mx-2">
        <Achievements />
        <Statistics />
        </div>
        <div className=" md:w-[66.33%]">
        <MatchHistory data={data} head={["Player","Result","Opponents"]}/>
        </div>
      </div>
    </div>
    </>
  )
}

export default Profile