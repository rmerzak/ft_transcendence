"use client"

import Achievements from '@/components/profile/Achievements'
import MatchHistory from '@/components/profile/MatchHistory'
import ProfileInformation from '@/components/profile/ProfileInformation'
import Statistics from '@/components/profile/Statistics'
import { data } from '@/data/MatchHistory'
import { User } from '@/interfaces'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'

import UserNotFound from '@/components/profile/UserNotFound'
import { ContextGlobal } from '@/context/contex'

import Profile from '../page'

function page() {

  const { username } = useParams();
  const [user, setUser] = useState<any>();
  const [error, setError] = useState<string | null>(null);
  const { profile }:User = useContext(ContextGlobal);
  const [loading, setLoading] = useState(true);
  
  const [BtnFriend, setBtnFriend] = useState<boolean>(false);

  useEffect(() => {
      const fetchProfile = async () => {
          try {
              const response = await axios.get(`http://localhost:3000/users/profile/${username}`, { withCredentials: true });
              const  user  = response.data;
              setUser(user);
              //setBtnFriend(profile?.username !== username);
              //console.log(user);
              //console.log('username :' , username);
              //console.log(response.data);
            } catch (error) {
              console.error('Error fetching profile:', error);
              setError('Error fetching profile');
            } finally {
              setLoading(false);
            }
          };
    fetchProfile();
    setBtnFriend(profile?.username !== username);
}, [username, profile]);
  if (loading) {
    return <div className="text-white text-3xl font-bold bg-profile w-full h-full flex items-center justify-center">Loading...</div>;
  }

  if (error || !user) {
    return <UserNotFound />;
  }
  //const shouldRenderErrorPage = error || !user;
  return (
    //profile?.username === username ? setBtnFriend(true) :
    //console.log('herrrrreee', profile?.username),
    //error ? <Page_502 /> :
    /*shouldRenderErrorPage ? (
      <UserNotFound />
    ) : (*/
      <div className="p-4 mx-2 bg-profile">
        <h1 className="text-white font-bold text-3xl text-center mb-3">Profile</h1>
        <div className="w-full h-[250px] border-spacing-1 mb-3 border-[#ffff]">
          <ProfileInformation profile={user} BtnFriend={BtnFriend} />
        </div>
        <div className="flex md:flex-row flex-col">
          <div className="shadow-2xl pb-6 bg-achievements md:w-[33.33%] w-full h-full backdrop-blur-lg md:mb-0 mb-2">
            <Achievements />
            <Statistics />
          </div>
          <div className="md:w-[66.33%] md:ml-2">
            <MatchHistory data={data} head={["Player", "Result", "Opponents"]} />
          </div>
        </div>
      </div>
    )
}

export default page;

  
