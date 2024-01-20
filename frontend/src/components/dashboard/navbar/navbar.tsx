'use client';
import { Bell, BellDot, MoreVertical, Search } from "lucide-react"
import { use, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link"
import { getUserInfo } from "@/api/user/user";
import { useRouter } from "next/navigation";
import { logout } from "@/api/user/user";
import { UsersAPIService } from "@/api/users/users.api";
import { ContextGlobal } from "@/context/contex";
import SearchBar from "../search/SearchBar";
import Notification from "@/components/notification/Notification";
const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState("/avatar.jpeg");
  const { profile ,setProfile}:any = useContext(ContextGlobal);
  const menyRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  if (typeof window !== 'undefined') {
    window.addEventListener("click", (e) => {
      if (e.target !== menyRef.current && e.target !== imgRef.current) {
        setOpen(false);
      }
    });
  }
  useEffect(() => {
    getUserInfo().then((res) => {
      if (res.data.image) {
        setProfile(res.data);
      }
    });
  }, [img]);
  async function logout() {
    try {
      await UsersAPIService.logout();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className=" flex items-center justify-between px-4 pt-4">
      <SearchBar />
      <div className='flex items-center space-x-4 justify-center p-3 ps-6'>
        <Notification />
        <div className="relative ">
          <img ref={imgRef} src={profile?.image} onClick={() => setOpen(!open)} alt="foto" className="w-10 h-10 rounded-full cursor-pointer" />
          {open &&
            <div ref={menyRef} className=" p-4 w-30 bg-navbar shadow-lg absolute z-10 -left-16 ">
              <ul>
                <li onClick={() => setOpen(false)} className="text-white p-2 text-lg cursor-pointer rounded hover:bg-[#78196F]"><Link href="/dashboard/profile">Profile </Link> </li>
                <li onClick={() => setOpen(false)} className="text-white p-2 text-lg cursor-pointer rounded hover:bg-[#78196F]"><Link href="/dashboard/profile/settings">Settings </Link> </li>
                <li onClick={() =>{ logout(); setOpen(false);}} className="text-white p-2 text-lg cursor-pointer rounded hover:bg-[#78196F]">Logout</li>
              </ul>
            </div>
          }
        </div>
        
      </div>
    </div>
  )
}

export default Navbar
