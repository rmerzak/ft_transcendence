import React, { useContext } from 'react';
import Image from 'next/image';
import { GameContext, GameContextProps } from '@/app/dashboard/game/context/gameContext';
import { UserEnum } from '@/app/dashboard/game/context/gameContext';
import { ContextGlobal } from '@/context/contex';

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
    }: GameContextProps = useContext(GameContext);

    // show the win swal for the winner
    // show the lose swal for the loser
    // if (player1Score === 5 || player2Score === 5) {
    //     if (player1Score === 5) {
    //         if (id === UserEnum.USER) {
    //             // show win swal
    //         } else if (id === UserEnum.OPPONENT) {
    //             // show lose swal
    //         }
    //     } else if (player2Score === 5) {
    //         if (id === UserEnum.USER) {
    //             // show lose swal
    //         } else if (id === UserEnum.OPPONENT) {
    //             // show win swal
    //         }
    //     }
    // }

    // aspect-[156px/365px] 
    return (
        <div className={`${className}`}>
            <div className="bg-neutral card card-side shadow-xl inline-block max-h-[365px]">
                <figure>
                    <div className="avatar justify-center p-[6%] hidden min-[822px]:block">
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
                    <div className="card-body max-[1342px]:p-2">
                        <h2 className="card-title font-sans border-b-[1px] max-[1342px]:text-sm pb-2 min-[1342px]:pb-[1rem] justify-center text-[#ffffff]/70">
                                {
                                    id === uid ? userName :
                                    id === oid ? opponentName :
                                    id === UserEnum.PLAYER ? profile.username :
                                    id === UserEnum.BOT ? 'Bot' :
                                    'Loading'
                                }
                        </h2>
                        <div className="card-actions justify-center">
                            <div className="stat place-items-center">
                                <div className="stat-title max-[1342px]:text-sm">Score</div>
                                <div className="stat-value text-[#ffffff]/70"> 
                                    {
                                        id === uid ? player1Score :
                                        id === oid ? player2Score :
                                        id === UserEnum.PLAYER ? player1Score :
                                        id === UserEnum.BOT ? player2Score : 0
                                    }
                                </div>
                                <div className="stat-desc">
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