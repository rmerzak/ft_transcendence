'use client'
import Achievements from '@/components/profile/Achievements'
import MatchHistory from '@/components/profile/MatchHistory'
import ProfileInformation from '@/components/profile/ProfileInformation'
import Statistics from '@/components/profile/Statistics'
import { data } from '@/data/MatchHistory'
import { User } from '@/interfaces'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function page() {
    const {username} = useParams();
    const [profile, setProfile] = useState<any>();
    useEffect(() => {
        
        const response = axios.get(`http://localhost:3000/users/profile/${username}`,{withCredentials:true}).then((res) => {setProfile(res.data); console.log(res);});
        console.log("responce",response);
    }, [username]);
    console.log("profile",profile);
  return (
    <div className="py-8 mx-2">
    <div className=" w-full h-[250px] border-spacing-1 mb-3 border-[#ffff]">
     <ProfileInformation profile={profile} btnFriend={true}/>
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
  )
}

export default page
