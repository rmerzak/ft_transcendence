import React from 'react';
import Image from 'next/image';
// import styles from '@/app/dashboard/game/page.module.css';

function ProfileComp({ className = ''}) {
    return (
        <div className={`${className}`}>
            <div className="flex flex-col items-center bg-gradient-to-br from-[#ffffff]/40 to-[#8B5CF6]/40 rounded-md p-4  backdrop-blur-md shadow-lg max-w-xs w-40">
                {/* Use max-w-xs to limit the width of the container */}
                <Image
                    className="select-none rounded-full w-20 h-20 transition-transform transform hover:scale-110 hover:rotate-6"
                    src="https://cdn.intra.42.fr/users/214d36851c25be972da1639e97173c4f/ymoutaou.jpg"
                    alt="Pong"
                    width={300}
                    height={300}
                    draggable={false}
                    priority={true}
                    />
                <h1 className="mt-2 text-slate-100 font-sans transition-colors select-none">
                    User
                </h1>
            </div>
        </div>
    )
}

export default ProfileComp;