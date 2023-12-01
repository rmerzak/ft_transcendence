'use client';
import { BellDot, MoreVertical } from "lucide-react"
import { useRef, useState } from "react";
import Link from "next/link"
import { Menu } from "@/constants";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  // const Menu = ["Profile", "Settings", "Logout"]
  const menyRef = useRef();
  const imgRef = useRef();
  if (typeof window !== 'undefined') {
    window.addEventListener("click", (e) => {
      if (e.target !== menyRef.current && e.target !== imgRef.current) {
        setOpen(false);
      }
    });
  }
    return (
      <div className=" flex justify-end px-4 pt-4">
         <div className='flex items-center space-x-4 justify-center p-3 ps-6'>
            <BellDot color="#ffff" size={30}/>
            <div className="relative ">
            <img ref={imgRef} src="/profile1.png" onClick={() => setOpen(!open)} alt="foto" className="w-10 h-10 rounded-full cursor-pointer"/>
            { open &&
            <div ref={menyRef} className=" p-4 w-30 shadow-lg absolute -left-16 ">
              <ul>
                {
                  Menu.map((menu) => (
                    <li onClick={() => setOpen(false)} className="text-white p-2 text-lg cursor-pointer rounded hover:bg-[#78196F]" key={menu.name}><Link href={menu.url}>{menu.name} </Link> </li>
                  ))
                }
              </ul>
            </div>
            }
            </div>
          </div>
           
      </div>
    )
  }
  
  export default Navbar
  