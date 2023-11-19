'use client';

import Link from 'next/link';
import { BellDot, ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
const Sidebar = ({children}) => {
  const [expanded, setExpanded] = useState(true);
    return (
      <aside className='h-screen'>
        <nav className='h-full flex flex-col bg-white border-r shadow-sm'>
          <div className='p-4 ob-2 flex justify-between items-center'>
            <img src="/logo.svg" alt="42" className={`${expanded ? "w-32":"w-0"} overflow-hidden transition-all`} />
          <button onClick={() => setExpanded(curr => !curr)} className='p-1.5 rounded-lg bg-gray-50 hover:bg-slate-100'>
            {expanded ? <ChevronFirst/> : <ChevronLast/>}
          </button>
          </div>
          <ul className='flex-1 px-3'>{children}
          </ul>
          <div className='border-t flex p-3'>
            <Image src="/profile1.png" alt="foto" width={40} height={40} className='rounded-[50px]'/>
            <div className='flex justify-between items-center w-52 ml-3'>
              <div className='leading-4'>
                <h4 className='font-bold text-sm'>John Doe</h4>
                <p className='text-xs text-gray-400'>Player | Email</p>
              </div>
              <BellDot size={20}/>
              <MoreVertical size={20}/>
            </div>
          </div>
        </nav>
      </aside>
    )
  }
  
export default Sidebar
