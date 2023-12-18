import React from 'react'

function MatchHistoryItem({ playerOne, playerTwo, result, ImgPlayerOne, ImgPlayerTwo }: { playerOne: string, playerTwo: string, result: string, ImgPlayerOne: string, ImgPlayerTwo: string }) {
    return (
        <div className='flex items-center w-full h-[60px] bg-body my-2 text-white  pb-1'>
            <div className='flex items-center w-1/3 h-[60px] justify-start md:justify-center text-[12px] md:text-[16px] '>
                <img src={ImgPlayerOne} alt="" className='w-[30px] h-[30px] md:w-[45px] md:h-[45px] ml-1 rounded-full mr-2'/>
                {playerOne}
            </div>
            <div className='flex items-center w-1/3 h-[60px] justify-center'>
                {result}
            </div>
            <div className='flex items-center  w-1/3 h-[60px] justify-start md:justify-center text-[12px] md:text-[16px] '>
            <img src={ImgPlayerTwo} alt="" className='w-[30px] h-[30px] md:w-[45px] md:h-[45px] rounded-full mr-2'/>
                {playerTwo}
            </div>
        </div>
    )
}

export default MatchHistoryItem
