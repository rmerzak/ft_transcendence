'use client';

import Link from 'next/link';
import {  ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useContext, createContext } from "react"
import { usePathname } from 'next/navigation';


const SidebarContext = createContext();
const Sidebar = ({children}) => {
  const [expanded, setExpanded] = useState(true);
    return (
      <aside className={`h-screen shadow-lg shadow-[#78196F]  bg-fuchsia-900/50 ${ expanded ? "w-40" : "md:w-20 w-15" }` }>
        <nav className={`h-full w-fill flex flex-col  `}>
            <div className='flex items-center justify-between mt-8 mb-32 scroll-pl-6 '>
              <img src="/pingsvg.svg" alt="42" className={`overflow-hidden transition-all ${expanded ? "w-10" : "w-0 " }`} />
              <span className={`text-white font-bold ${expanded ? "w-20" : "hidden" }`}>PingPong</span>
              <div onClick={() => setExpanded(curr => !curr)} className='p-1 rounded-lg  bg-gray-50 hover:bg-slate-100 cursor-pointer'>
                {expanded ? <ChevronLeft size={20} className='rounded-full'/> : <ChevronRight size={20}/>}
              </div>
            </div>

          <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-col px-3">{children}</ul>
        </SidebarContext.Provider>
        </nav>
      </aside>
    )
  }
  
export default Sidebar

export function SidebarItem({ icon, text, to }) {
  const currentRoute = usePathname();
  const { expanded } = useContext(SidebarContext)
  return (
    <>
    <Link href={to}  >   
    <li className={` ${currentRoute === to ? " bg-[#78196F]" : "text-white"} relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group text-white ${ expanded ? "w-35 ml-3" : "w-15" }`}>
      {icon}
      <span className={` overflow-hidden transition-all  ${ expanded ? "w-35 ml-3" : "w-0" }`}>
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