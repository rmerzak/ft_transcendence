import {MdDashboard} from 'react-icons/md';
import { RiPingPongFill } from "react-icons/ri";
import { CiUser, CiChat1 } from "react-icons/ci";
import { IoChatboxOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { IoGameControllerOutline } from "react-icons/io5";

import Link from 'next/link';
const menuItems = [
  {
    title : "Pages",
    list : [
      {
        title: "home",
        path: "/dashboard/home",
        icon :<MdDashboard />,
      }
    ]
  }
]

const Sidebar = () => {
    return (
      <div className='flex'>
        <div className='fixed w-100 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between'>
          <div className='flex flex-col items-center'>
            <Link href='/dashboard/home'>
              <div className='bg-red-400 text-white p3 rounded-lg inline-block'>
                <RiPingPongFill  size={40}/>
              </div>
            </Link>
            <span className='border-b-[1px] border-gray-200 w-full p-2'></span>
            <Link href='/dashboard/profile'>
              <div className='bg-gray-100 hover:bg-gray-400 cursor-pointer my-4 p3 rounded-lg inline-block'>
                <CiUser  size={40}/>
              </div>
            </Link>
            <Link href='/dashboard/chat'>
              <div className='bg-gray-100 hover:bg-gray-400 cursor-pointer my-4 p3 rounded-lg inline-block'>
                <CiChat1  size={40}/>
              </div>
            </Link>
            <Link href='/dashboard/friends'>
              <div className='bg-gray-100 hover:bg-gray-400 cursor-pointer my-4 p3 rounded-lg inline-block'>
                <FaUserFriends  size={30}/>
              </div>
            </Link>
            <Link href='/dashboard/game'>
              <div className='bg-gray-100 hover:bg-gray-400 cursor-pointer my-4 p3 rounded-lg inline-block'>
                <IoGameControllerOutline  size={40}/>
              </div>
            </Link>
          </div>
          <div></div>
        </div>
      </div>
    )
  }
  
  export default Sidebar
  