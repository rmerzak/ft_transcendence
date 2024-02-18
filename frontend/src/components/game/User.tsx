import React, { useContext } from 'react';
import Image from 'next/image';
import { useGame } from '@/app/dashboard/game/context/gameContext';
import { UserEnum } from '@/app/dashboard/game/context/gameContext';
import { ContextGlobal } from '@/context/contex';
import { useRouter } from 'next/navigation';

function User({ className = '', id = UserEnum.USER}: { className?: string; id?: number }) {
    const { profile }:any = useContext(ContextGlobal);
    const { 
            oid,
            userName,
            userImage,
            uid,
            opponentName,
            opponentImage,
            player1Score,
            player2Score,
            player1Elo,
            player2Elo,
    } = useGame();

    return (
        <div className={`${className}`}>
            <div className="bg-neutral card md:card-side md:shadow-xl inline-block md:max-h-[365px] w-[80%] md:w-full ">
                <figure className='hidden md:flex'>
                    <div className="avatar justify-center p-[6%] hidden md:flex  items-center ">
                        <div className="w-[8.5rem] rounded-xl max-[1342px]:h-[80px] max-[1342px]:w-auto">
                            <Image
                                 src={
                                        id === uid ? userImage :
                                        id === oid ? opponentImage :
                                        id === UserEnum.PLAYER ? profile.image :
                                        id === UserEnum.BOT ? '/game/bot1.gif' :
                                        '/game/avatar.jpeg'
                                    }
                                    alt="User Profile"
                                    width={200}
                                    height={200}
                                    draggable={false}
                                    priority={true}
                                    
                                  />
                        </div>
                    </div>

                </figure>
                    <div className="card-body max-[1342px]:p-2 flex-row md:flex-col items-center justify-center h-10 md:h-full">
                        <h2 className="card-title font-sans md:border-b-[1px] max-[1342px]:text-sm md:pb-2 min-[1342px]:pb-[1rem] justify-center text-[#ffffff]/70">
                                {
                                    id === uid ? userName :
                                    id === oid ? opponentName :
                                    id === UserEnum.PLAYER ? profile.username :
                                    id === UserEnum.BOT ? 'Bot' :
                                    'Loading'
                                }
                        </h2>
                        <div className="md:card-actions flex items-center justify-center  h-full">
                            <div className="stat place-items-center ">
                                <div className="stat-title max-[1342px]:text-sm hidden md:flex text-white/25">Score</div>
                                <div className="stat-value text-[#ffffff]/70 text-[1rem] md:text-[1.7rem]  "> 
                                    {
                                        id === uid ? player1Score :
                                        id === oid ? player2Score :
                                        id === UserEnum.PLAYER ? player1Score :
                                        id === UserEnum.BOT ? player2Score : 0
                                    }
                                </div>
                                <div className="stat-desc hidden md:flex text-white/25">
                                    {
                                        id === uid ? player1Elo :
                                        id === oid ? player2Elo :
                                        id === UserEnum.PLAYER ? '' :
                                        id === UserEnum.BOT ? '' : '?'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default User;