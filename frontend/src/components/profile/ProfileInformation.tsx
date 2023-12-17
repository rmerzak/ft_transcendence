import { PlusCircle } from "lucide-react"
import Image from "next/image"

const ProfileInformation = () => {     
    return (     
    <div className="bg-mberri w-full">
    <div className=" w-full flex items-end justify-between">
       <div className="relative ">
            <div className="w-[120px] h-[120px] rounded-full">
                <Image src="/dfpic.png" alt="profile pic" width={100} height={100}/>
                    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] h-[15px] w-[15px] rounded-full bg-custom-green"></div>
            </div>
        </div>
        <div>
       <p className="text-white font-bold text-400 text-center" style={{fontSize: '1.4vw', marginRight: "10px"}}>Freax</p>
       <Image src="/freax.png" alt="freax" width={100} height={100} style={{width: "50px", height: "100px", marginRight: "10px"}}/>
       </div>
    </div>
    <div className=" bg-mberri1 flex items-center justify-evenly w-full ">
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