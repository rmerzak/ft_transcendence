'use client'
import { getUserInfo } from '@/api/user/user';
import Navbar from '@/components/dashboard/navbar/navbar'
import Sidebar from '@/components/dashboard/sidebar/sidebar'
import { ContextGlobal, ContextProvider } from '@/context/contex';
import axios from 'axios';
import { useContext, useEffect } from 'react';


const NotFound = ({children} : any) => {
  const { profile, setProfile } = useContext(ContextGlobal);
  useEffect(() => {
    const user = axios.get(`http://localhost:3000/users/me`, {withCredentials:true}).then((res) => {setProfile(res.data);}).catch((err) => { console.log(err)});
  }, []);
    return (
      <div className="flex login-gradient h-screen">

        <div className='bg-profile mx-4 my-8 w-full'>

            <div className='text-white text-center mt-10'>
              <h1 className='font-bold text-4xl mb-8'>Oops!</h1>
              <h1 className='font-thin mt-12 text-3xl'>Page Not Found</h1> </div>
            
            <div className='text-pink-400 flex items-center justify-center w-full m-10'>
                <div className='font-thin text-[18rem]'>4</div>
                <div className='flex items-center rounded-full bg-white'>
                <img src="/pong.gif" alt="not found" className='rounded-full object-cover w-[170px] h-[240px]'/></div>
                <div className='font-thin text-[18rem]'>4</div>
            </div>
          </div>

      </div>
    )
  }
  
  export default NotFound
  
  