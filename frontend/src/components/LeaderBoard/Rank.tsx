import React from "react";

interface RankEntreProps {
  First: string;
  Second: string;
  Last: string;
  rank: number;
  Best: number;
}

export default function Rank({ rank, First, Second, Last, Best }: RankEntreProps) {
  return (
    <>
     <div className="flex flex-col items-center h-[600px] justify-center bg-[#FFFFFF]/15 rounded-xl mt-7 lg:w-[30%]">
     <div className="h-[95%] justify-between flex flex-col w-[90%] ">
       <div className="flex justify-center items-center ">
         <p className="border-b font-extralight text-white text-xl h-10">
           Top Players
         </p>
       </div>
       <div className="h-auto">
         <div className="flex justify-center ">
           <div className="flex flex-col justify-center items-center w-[80px] h-[80px]">
             <div className="w-10 h-10">
               <img src={"/trone.png"}
                 alt=""
                 height={500}
                 width={500}
                 className="w-full h-full"
               />
             </div>
             <div className="w-[70px]  h-[70px]">
               <img
                 src={First}
                 alt=""
                 height={500}
                 width={500}
                 className="w-full h-full rounded-full"
               />
             </div>
             <p className="text-3xl text-white">#1</p>
           </div>
         </div>
         <div className="flex justify-between">
           <div>
             <img src={Second} alt="" height={50} width={50} className="rounded-full"/>
             <p className="text-2xl text-white">#2</p>
           </div>
           <div>
             <img src={Last} alt="" height={50} width={50} className="rounded-full"/>
             <p className="text-2xl text-white ">#3</p>
           </div>
         </div>
       </div>
       <div className="flex flex-col items-center justify-between h-[250px]">
       <p className="border-b font-extralight text-white text-xl h-10">
          Your Rank
         </p>
         <div className='relative'>
              <img src="/lkas.png" alt="" width={150} height={50}/>
              <div className='absolute md:top-10 top-3 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <p className='text-gray-500 font-bold md:text-3xl text-[10px]'>{`#` + rank}</p>
              </div>
            </div>
         <p className="border-b font-extralight text-white text-xl h-10">
           Your Best Rank
         </p>
         <p className="text-3xl text-white font-bold">{"#" + Best}</p>
       </div>
     </div>
    </div>
    </>
);
}




