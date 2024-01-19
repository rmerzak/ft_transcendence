"use client"

import { useState, useEffect } from "react"

const NotFound = () => {
    
    return (
      <div className="flex login-gradient h-screen">

        <div className='relative bg-profile mx-6 my-2 w-full h-[96%]'>
            
            <div className='text-white text-center md:mt-8 mt-1'>
              <h1 className='font-bold text-4xl my-5'>Oops!</h1>
              <h1 className='font-thin text-3xl mt-10'>Page Not Found</h1> </div>
              
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-400 flex items-center justify-center w-full md:h-[600px] h-[60%]'>
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
  
  