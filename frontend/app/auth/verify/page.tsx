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

import { PlusCircle, User, } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from 'next-client-cookies'
const Verify = () => {
  const cookies = useCookies();

  const token = cookies.get('JWT');
  const inputRef = useRef(null);
  const [image, setImage] = useState("");
  const [user, setUser] = useState("");
  const handleImageClick = () => {
    inputRef.current.click();
  }
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file))
  }

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/verify`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoicm1lcnpha0BzdHVkZW50LjEzMzcubWEiLCJpYXQiOjE3MDE0MzM0NzUsImV4cCI6MTcwMTQ0NDg3NX0.aXjpYY9dHWUK2BbgYIhJa8UDUCwZDZX1IrzezXVH3ng`,
            },
          }
        );
        console.log(response.data);
        setUser(response.data);
        setImage(response.data.image);
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

        <form action="" className=" rounded-2xl w-full flex items-center justify-center flex-col max-w-4xl">
          <div onClick={handleImageClick} className="w-[150px] h-[150px] rounded-full">
            <img src={image} className="rounded-full" />
            <input type="file" ref={inputRef} onChange={handleImageChange} className="hidden" />
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] rounded-full bg-white"><PlusCircle color="#7a7a7a" /></div>
          </div>
          <div className="flex items-center bg-white mt-6 border-[0.063rem] rounded-[1rem] overflow-hidden relative ">
            <input type="text" placeholder={`default: ${user.username}`} className="w-[20.438rem] h-[2.75rem] pl-[1.063rem] leading-normal" />
            <User className="absolute right-3" />
          </div>
          <div className="pt-5">

            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer"/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-white dark:text-gray-300">Two authentication factor</span>
            </label>
          </div>

        </form>
      </div>

    </div>
  );
};

export default Verify;