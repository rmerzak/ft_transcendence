'use client'
import { getUserInfo } from '@/api/user/user';
import Navbar from '@/components/dashboard/navbar/navbar'
import Sidebar from '@/components/dashboard/sidebar/sidebar'
import { ContextGlobal, ContextProvider } from '@/context/contex';
import axios from 'axios';
import { useContext, useEffect } from 'react';


const NotFound = () => {
    return (
      <div className="flex login-gradient h-screen">

        <div className='bg-profile mx-6 my-6 w-full'>
            
            <div className='text-white text-center md:mt-10 mt-2'>
              <h1 className='font-bold md:text-4xl md:mb-8 text-2xl'>Oops!</h1>
              <h1 className='font-thin mt-1 md:mt-12 md:text-3xl text-1xl'>Page Not Found</h1> </div>

            <div className='text-pink-400 flex items-center justify-center w-full h-[60%]'>
                <div className='font-thin md:text-[19rem] text-[10rem]'>4</div>
                <div className='rounded-t-full rounded-b-full bg-white'>
                <img src="/pong.gif" alt="not found" className='rounded-full object-cover md:w-[200px] md:h-[230px] w-[100px] h-[115px]'/></div>
                <div className='font-thin md:text-[19rem] text-[10rem]'>4</div>
            </div>
          
        </div>
      </div>
    )
  }
  
  export default NotFound
  
  