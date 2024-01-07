import React, { useContext } from 'react';
import Image from 'next/image';
import { useGame } from '@/app/dashboard/game/gameContex';
import { ContextGlobal } from '@/context/contex';

function User({ className = '', id = 1}: { className?: string; id?: number }) {
    const { profile }:any = useContext(ContextGlobal);
    const { oid, userName, userImage, uid, opponentName, opponentImage, player1Score, player2Score } = useGame();
    return (
        <div className={`${className}`}>
            <div className="bg-neutral card card-side shadow-xl inline-block ">
                <figure>
                    <div className="avatar justify-center p-[6%]">
                        <div className="w-[8.5rem] rounded-xl">
                            <Image
                                 src={ id === uid ? userImage : id === oid ? opponentImage : '/avatar.jpeg'}
                                    alt="User Profile"
                                    width={200}
                                    height={200}
                                    draggable={false}
                                    priority={true}
                                  />
                        </div>
                    </div>

                </figure>
                    <div className="card-body ">
                        <h2 className="card-title font-sans border-b-[1px] pb-[1rem] justify-center text-[#ffffff]/70">{id === uid ? userName : id === oid ? opponentName : 'Loading...'}</h2>
                        <div className="card-actions justify-center">
                            <div className="stat place-items-center">
                                <div className="stat-title">Score</div>
                                <div className="stat-value text-[#ffffff]/70"> {id === 1 ? player1Score : player2Score} </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default User;