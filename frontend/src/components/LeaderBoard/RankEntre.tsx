import React from "react";

const RankEntre: React.FC<{
    rank: number;
    avatarSrcWinner: string;
    avatarSrcSecond: string;
    avatarSrcThird: string;
    bestRank: number;
  }> = ({ rank, avatarSrcWinner,  avatarSrcSecond, avatarSrcThird, bestRank}) => {
    return (
        <div className='rounded-2xl w-[27%] bg-[#FFFFFF]/10 ml-4 py-2 md:h-[600px] h-[400px]'>
            <h1 className='text-gray-300 font-thin md:text-xl text-[10px] text-center' style={{ textShadow: '1px 1px 2px rgba(255, 255, 255, 0.6)' }}>Top Players</h1>
          <div className="flex justify-center mt-1">
              <div className="mb-4 border-b border-white w-6 md:w-16"></div>
          </div>
         <div className='flex justify-between m-6'>
            <div className='mt-16'>
              <img src={avatarSrcSecond} alt="" className='md:w-[55px] md:h-[55px] w-[30px] h-[30px] rounded-full'/>
              <p className='text-white font-bold text-center'>#2</p>
            </div>
            <div className='relative'>
              <img src={avatarSrcWinner} alt="" className='md:w-[65px] md:h-[65px] w-[42px] h-[42px] rounded-full'/>
              <p className='text-white font-bold text-center'>#1</p>
              <img src="/king.png" alt="avatar" className="absolute -top-3 left-1 md:-top-7 md:left-[1rem] md:w-[30px] md:h-[30px] w-[20px] h-[20px]" style={{ filter: 'saturate(150%) brightness(120%)' }}/>
            </div>
            <div className='mt-16'>
              <img src={avatarSrcThird} alt="" className='md:w-[55px] md:h-[55px] w-[30px] h-[30px] rounded-full'/>
              <p className='text-white font-bold text-center'>#3</p>
            </div>
         </div>
         <h1 className='text-gray-300 font-thin md:text-xl text-[10px] text-center' style={{ textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)' }}>Your Rank</h1>
          <div className="flex justify-center mt-1">
              <div className="mb-4 border-b border-white w-6 md:w-12"></div>
          </div>
          <div className='flex justify-center mb-4'>
            <div className='relative'>
              <img src="/trophy.png" alt="avatar" className="md:w-[140px] md:h-[140px] w-[42px] h-[40px]"/>
              <div className='absolute md:top-10 top-3 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <p className='text-gray-500 font-bold md:text-3xl text-[10px]'>#{rank !== 0 ? rank : '?'}</p>
              </div>
            </div>
          </div>
          {/* <h1 className='text-gray-300 font-thin md:text-xl text-[10px] text-center mt-8' style={{ textShadow: '1px 1px 2px rgba(255, 255, 255, 0.3)' }}>Your Best Rank</h1>
          <div className="flex justify-center mt-1">
              <div className="md:mb-4 mb-2 border-b border-white w-6 md:w-16"></div>
          </div> */}
          {/* <p className='text-white font-bold text-center md:text-3xl'> {`#` + bestRank}</p> */}
     </div>
    )
}

export default RankEntre