import React from 'react';
import Image from 'next/image';

function User({ className = ''}) {
    return (
        <div className={`${className}`}>
            <div className="bg-neutral card card-side bg-base-100 shadow-xl inline-block ">
                <figure>
                    <div className="avatar justify-center p-[6%]">
                        <div className="w-[8.5rem] rounded-xl">
                            <Image
                                 src="/avatar.jpeg"
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
                        <h2 className="card-title font-sans border-b-[1px] pb-[1rem] text-[#ffffff]/70">User Name</h2>
                        <div className="card-actions justify-center">
                            <div className="stat place-items-center">
                                <div className="stat-title">Score</div>
                                <div className="stat-value">0</div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default User;