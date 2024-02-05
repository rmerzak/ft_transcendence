// 'use client';

// import Link from 'next/link';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { useState } from 'react';
// import { usePathname } from 'next/navigation';
// import {  BookUser,  Gamepad2, Home , MessageCircle, User } from 'lucide-react'
// const sidebarItems = [
//   {
//     icon: <User color="#ffff" size={25} />,
//     to: "/dashboard/profile",
//     text: "Profile"
//   },
//   {
//     icon: <MessageCircle color="#ffff" size={25} />,
//     to: "/dashboard/chat",
//     text: "Chat"
//   },
//   {
//     icon: <BookUser color="#ffff" size={25} />,
//     to: "/dashboard/friends",
//     text: "Friends"
//   },
//   {
//     icon: <Gamepad2 color="#ffff" size={25} />,
//     to: "/dashboard/game",
//     text: "Game"
//   }
// ];


// const Sidebar = () => {
//   const [expanded, setExpanded] = useState(true);
//   const currentRoute = usePathname();
//   return (
//     <aside className={`h-screen shadow-lg shadow-[#78196F]  bg-fuchsia-900/50 md:w-40`}>
//       <nav className={`h-full w-fill flex flex-col  `}>
//         <div className='flex items-center justify-between mt-8 mb-32 scroll-pl-6 '>
//           <img src="/pingsvg.svg" alt="42" className={`overflow-hidden transition-all md:w-10 w-0`} />
//           <span className={`text-white font-bold md:w-20 lg:block hidden`}>PingPong</span>
//         </div>
//         {sidebarItems.map(({ icon, to, text }, index) => (
//           <Link key={index} href={to}>
//             <li className={` ${currentRoute === to ? " bg-[#78196F]" : "text-white"} relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group text-white md:w-35 md:ml-3 w-15`}>
//               {icon}
//               <span className={` overflow-hidden transition-all  md:w-35 md:ml-3 hidden md:block`}>
//                 {text}
//               </span>
//                 <div className={` absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-10`}>
//                   {text}
//                 </div>
//             </li>
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   )
// }

// export default Sidebar

'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {  BookUser,  Gamepad2, Home , MessageCircle, User } from 'lucide-react'
const sidebarItems = [
  {
    icon: <Home color="#ffff" size={35} strokeWidth={1.2}/>,
    to: "/dashboard",
    text: "LeaderBoard"
  },
  {
    icon: <MessageCircle color="#ffff" size={35} strokeWidth={1.2}/>,
    to: "/dashboard/chat",
    text: "Chat"
  },
  {
    icon: <BookUser color="#ffff" size={35} strokeWidth={1.2}/>,
    to: "/dashboard/friends",
    text: "Friends"
  },
  {
    icon: <Gamepad2 color="#ffff" size={35} strokeWidth={1.2}/>,
    to: "/dashboard/game",
    text: "Game"
  }
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const currentRoute = usePathname();
  return (
    // <aside className={`h-screen shadow-2xl backdrop-blur-lg bg-[#311150]/80 md:w-52`}>
    <aside className={`md:w-[85px] md:h-screen max-md:fixed max-md:bottom-0 shadow-2xl backdrop-blur-lg bg-[#311150]/80 max-md:w-full max-md:h-[80px] z-10 lg:w-52 duration-100 ease-in-out`}>
      <nav className={`h-full flex md:flex-col max-md:justify-evenly max-md:items-center`}>
        {/* <div className='flex items-center space-x-3 mt-8 mb-32 scroll-pl-6 md:mx-6 mx-2'> */}
        <div className='hidden md:flex items-center md:space-x-3 scroll-pl-6 md:mx-6 mx-2 md:mt-8 md:mb-32'>
          <img src="/pingsvg.svg" alt="42" className={`overflow-hidden transition-all md:w-10`} />
          <span className={`text-white text-xl md:w-50 lg:block hidden `}>PingPong</span>
        </div>
        {sidebarItems.map(({ icon, to, text }, index) => (
          <Link key={index} href={to}>
            <li className={` ${currentRoute === to ? " bg-[#78196F]" : "text-white"} hover:bg-[#78196F]/30 hover:text-white"}  relative flex items-center py-2 px-3 my-2 font-medium rounded-md cursor-pointer transition-colors group text-white md:w-35 md:mx-3 w-15`}>
              {icon}
              <span className={`overflow-hidden transition-all  md:w-35 md:ml-3 hidden lg:block`}>
                {text}
              </span>
                <div className={`absolute left-1/8 bottom-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-10`}>
                  {text}
                </div>
            </li>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar

