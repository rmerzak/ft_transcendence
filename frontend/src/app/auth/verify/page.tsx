"use client";
// 'use cli'



// const Verify = async () => {
//   const user = await getAuthData();
//   //console.log(user);
//   return (
//     <div className="h-[500px] w-full bg-red-400">
//     </div>
//   );
// };

// export default Verify;
import Cookies from "js-cookie";
import { PlusCircle, User, } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import PreAuthForm from "@/components/auth/PreAuthForm";
const Verify = () => {
  const [user, setUser] = useState("");
  
  
  
  const jwtToken : any = Cookies.get("accesstoken");
  console.log("dd",jwtToken);
  useEffect(() => {
    async function getUserData() {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/verify`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUserData();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 login-gradient">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-5 md:px-20 text-center">
        <div className="text-white font-bold text-[48px]">Create Your Profile</div>
        <PreAuthForm user={user} img={user.image} />
        <div className="flex pt-5 items-center flex-col">
          <div>
            <img src="/pingsvg.svg" alt="42" className="overflow-hidden transition-all w-10" />
          </div>
          <div className="text-white">PingPong</div>
        </div>
      </div>

    </div>
  );
};

export default Verify;