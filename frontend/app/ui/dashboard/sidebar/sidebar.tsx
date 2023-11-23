'use client';

import Link from 'next/link';
import { BellDot, ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useContext, createContext } from "react"
import { usePathname } from 'next/navigation';


const SidebarContext = createContext();
const Sidebar = ({children}) => {
  const [expanded, setExpanded] = useState(false);
    return (
      <aside className='h-screen'>
        <nav className='h-full flex flex-col  border-r shadow-sm'>
          <div className='p-4 pb-2 flex justify-between items-center'>
            <div className='flex items-center'>
            <img src="/pingsvg.svg" alt="42" className={`overflow-hidden transition-all ${expanded ? "w-10" : "w-0" }`} />
            <span className={`text-white font-bold ${expanded ? "w-10" : "invisible" }`}>PingPong</span>
            </div>
          <button onClick={() => setExpanded(curr => !curr)} className='p-1.5 rounded-lg bg-gray-50 hover:bg-slate-100'>
            {expanded ? <ChevronFirst/> : <ChevronLast/>}
          </button>
          </div>
          <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
          <div className='border-t flex p-3'>
            <img src="/profile1.png" alt="foto" className="w-10 h-10 rounded-md"/>
            <div className={` flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
              <div className='leading-4 text-white'>
                <h4 className='font-bold text-sm'>John Doe</h4>
                <p className='text-xs '>Player | Email</p>
              </div>
              <BellDot color="#ffff" size={20}/>
              <MoreVertical color="#ffff" size={20}/>
            </div>
          </div>
        </nav>
      </aside>
    )
  }
  
export default Sidebar

export function SidebarItem({ icon, text, to }) {
  const currentRoute = usePathname();
  const { expanded } = useContext(SidebarContext)
  console.log(currentRoute)
  return (
    <>
    <Link href={to}  >   
    <li className={` ${currentRoute === to ? " bg-[#78196F]" : "text-white"} relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group text-white `}>
      {icon}
      <span className={` overflow-hidden transition-all  ${ expanded ? "w-52 ml-3" : "w-0" }`}>
        {text}
      </span>
      {!expanded && (
        <div className={` absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
            {text}
        </div>
      )}
    </li>
    </Link>
    </>
  )
}