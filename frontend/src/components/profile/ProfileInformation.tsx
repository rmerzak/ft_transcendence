import { User } from "@/interfaces"
import { PlusCircle } from "lucide-react";
import { UserPlus } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import Image from "next/image"

const ProfileInformation = ({profile,btnFriend}:{profile:User, btnFriend:boolean}) => {     
    return (     
    <div className="bg-mberri w-full flex items-end relative">
    <div className="bg-mberri1 flex items-center justify-evenly w-full backdrop-blur-sm relative">
       <div>
            <p className="text-[#CE6FF5]">First Name</p>
            <p className="text-[#FFFFFF] text-opacity-50">{profile?.firstname}</p>
        </div>
        <div>
            <p className="text-[#CE6FF5]">Last Name</p>
            <p className="text-[#FFFFFF] text-opacity-50">{profile?.lastname}</p>
        </div>
        <div>
            <p className="text-[#CE6FF5]">Nick Name</p>
            <p className="text-[#FFFFFF] text-opacity-50">{profile?.username}</p>
        </div>
        <div>
            <p className="text-[#CE6FF5]">Email</p>
            <p className="text-[#FFFFFF] text-opacity-50">{profile?.email}</p>
        </div>
        {btnFriend && <div>
            <button className="text-green-500 pr-1"> <MessageCircle /></button>
            <button className="text-blue-500  pl-1"><UserPlus /></button>
        </div>}
       </div>
       <div className="w-full flex items-end justify-between absolute top-12 left-0">
       <div>
            <div className="relative w-[120px] h-[120px] rounded-full">
                <Image src={profile?.image} alt="profile pic" width={100} height={100} className="rounded-full"/>
                    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] h-[15px] w-[15px] rounded-full bg-custom-green"></div>
            </div>
        </div>
        <div>
       <p className="text-gray-300 font-thin ml-1">Freax</p>
       <Image src="/freax.png" alt="freax" width={100} height={100} style={{width: "50px", height: "101px", marginRight: "5px"}}/>
       </div>
    </div>
    </div>
    )
}

export default ProfileInformation

/**
 * 
 * <div className="bg-mberri1 flex items-center justify-evenly w-full">
       <div>
            <p className="text-[#CE6FF5]">First Name</p>
            <p className="text-[#FFFFFF] text-opacity-50">Name</p>
        </div>
        <div>
            <p className="text-[#CE6FF5]">Last Name</p>
            <p className="text-[#FFFFFF] text-opacity-50">Name</p>
        </div>
        <div>
            <p className="text-[#CE6FF5]">Nick Name</p>
            <p className="text-[#FFFFFF] text-opacity-50">Name</p>
        </div>
        <div>
            <p className="text-[#CE6FF5]">Email</p>
            <p className="text-[#FFFFFF] text-opacity-50">test@student.1337.ma</p>
        </div>
       </div>
 * 
 * flex items-end py-4 justify-around mx-auto
 * <div className="w-[150px]  h-[150px] rounded-full">
        <img src={image} className="rounded-full" />
        <label htmlFor="file"></label>
        <input type="file"
        
          id="file" className="hidden" />
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] rounded-full bg-white"><PlusCircle color="#7a7a7a" /></div>
      </div>





      <div className="relative ">
            <div className="w-[130px] border h-[130px] rounded-full">
                <img src="/dfpic.png" className="rounded-full" />
                    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] h-[20px] w-[20px] rounded-full  bg-green-500">
                    </div>
            </div>
        </div>

         <div>
       <p className="text-gray-400 text-center" style={{fontSize: '1vw'}}>Freax</p>
       <img src="/freax.png" alt="freax" style={{width: "60px", height: "110px"}}/>
       </div>
 * 
 */