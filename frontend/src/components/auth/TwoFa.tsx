"use client";

import { color } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { ContextGlobal } from "@/context/contex";
import { ToastContainer, toast } from "react-toastify";
const TwoFa = () => {
  const { profile, setProfile }:any = useContext(ContextGlobal);
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  async function handleSubmit(event: any) {
    event.preventDefault();
    if (!/^\d+$/.test(code)) {
      toast.error('Please enter a valid numeric code');
      return;
    }
    await axios.get(`${process.env.API_BASE_URL}/auth/2fa/check/` + code, {
      withCredentials: true,
    }).then((res) => {

      if (res.data.success === true){
        setProfile({...profile, twoFactorEnabled: true});
        router.push("/dashboard/profile");
      } else {
        toast('invalid code');
      }
    }).catch((err) => { 
      router.push("/");
    });
  }


  return (
    <div className="bg-[#311251] drop-shadow-2xl w-[380px] md:w-[500px] bg-opacity-50 pb-10 rounded-2xl  flex items-center justify-center flex-col max-w-4xl">
      <QrCode size={100} color="#fff" />
      <div className="text-white text-[20px]" style={{ marginBottom: "10px", marginTop: "10px" }}>Please enter 2FA code</div>
      <div className="text-white font-extralight text-[14px]" style={{ marginBottom: "10px", marginTop: "10px" }}>Two-factor authentication (2FA) is enable for your account. <br /> Please enter a code to log in.</div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center bg-white mt-6 border-[0.063rem] rounded-[1rem] overflow-hidden relative ">
          <label htmlFor="code"></label>
          <input type="text" id="code" onChange={(e) => {setCode(e.target.value)}} placeholder="Two-factor authentication code" className="w-[20.438rem] h-[2.75rem] pl-[1.063rem] leading-normal" />
        </div>
        <div className="pt-5 flex items-center justify-between w-[20.438rem] h-[2.75rem]" style={{ marginBottom: "10px", marginTop: "10px" }}>
        <button  onClick={() => router.push("/auth/login")} className="bg-[#79196F]  w-[100px] h-[40px] text-white py-2 px-4 rounded-[10px] border-colors">Back</button>
          <button type="submit" className="bg-[#79196F] w-[100px] h-[40px] text-white py-2 px-4 rounded-[10px]">Continue</button>
        </div>

      </form>
    </div >
  )

}

export default TwoFa