"use client"
import React, { useEffect, useState } from 'react'


const UserNotFound = () => {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    useEffect(() => {
      const calculateSize = () => {
        const windowHeight = window.innerHeight;
        const secondDivHeight = 0.3 * windowHeight;
        const windowWidth = window.innerWidth;
        const secondWidth = 0.3 * windowWidth;
        setWidth(secondWidth);
        setHeight(secondDivHeight);
      };
      calculateSize();
      window.addEventListener("resize", calculateSize);
      return () => {
        window.removeEventListener("resize", calculateSize);
      };
    }, []);
    return (
      <div className="flex login-gradient h-screen ">

        <div className='relative bg-profile mx-6 my-2 w-full h-[96%]'>
            
            <div className='text-white text-center md:mt-8 mt-1'>
              <h1 className='font-bold text-4xl my-5'>Oops!</h1>
              <h1 className='font-bold text-3xl mt-10'>user Not Found</h1> </div>
              { window.innerHeight > 560 && (
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-400 flex items-center justify-center w-full md:h-[600px] h-[60%]'>
                <div className='font-thin md:text-[19rem] text-[10rem]'>5</div>
                <div className='rounded-t-full rounded-b-full bg-white mr-2'>
                <img src="/pong.gif" alt="not found" className='rounded-full object-cover md:w-[200px] md:h-[230px] w-[100px] h-[115px]'/></div>
                <div className='font-thin md:text-[19rem] text-[10rem]'>2</div>
            </div>
              )}
          
        </div>
      </div>
    )
}

export default UserNotFound