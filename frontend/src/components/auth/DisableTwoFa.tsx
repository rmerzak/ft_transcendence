'use client';
import { ContextGlobal } from "@/context/contex";
import axios from "axios";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Key, User } from "lucide-react";
function DisableTwoFa() {
  const router = useRouter();
  const { profile, setProfile } : any= useContext(ContextGlobal);
  const [code, setCode] = useState<string>("");
  async function handleSubmit(event: any) {
    event.preventDefault();
    if(code.length <= 0)
      toast.warn("Please enter a code!");
    else {
      const response = await axios.get(`${process.env.API_BASE_URL}/auth/2fa/disable/` + code, {
        withCredentials: true,
      }).then((res) => {
  
        if (res.data === true){
          setProfile({...profile, twoFactorEnabled: false, twoFactorSecret: ""});
          toast("2FA has been disabled!");
        }else {
          toast.error("2FA code is invalid!");
        }
      }).catch((err) => { router.push("/");});
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
        <div className="flex items-center  bg-white mt-6  rounded-[1rem] overflow-hidden relative ">
          <label htmlFor="code"></label>
          <input type="text" onChange={(e) => { setCode(e.currentTarget.value) }} id="code" placeholder="2FA authentication code" className="w-[15.438rem] h-[2.5rem] md:w-[20.438rem] md:h-[2.75rem] leading-normal" />
          <Key className="absolute right-3" />
        </div>
        <div className="pt-5 flex items-center justify-center w-[20.438rem] h-[2.75rem]" style={{ marginBottom: "10px", marginTop: "10px" }}>
          <button type="submit" className="bg-[#79196F] w-[100px] h-[40px] text-white py-2 px-4 rounded-[10px]">Disable</button>
        </div>
      </form>
    </div>
  )
}

export default DisableTwoFa
