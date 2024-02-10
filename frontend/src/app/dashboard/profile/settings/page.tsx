'use client'
import PreAuthForm from '@/components/auth/PreAuthForm'
import { ContextGlobal } from '@/context/contex';
import React, { useContext } from 'react'
import DisableTwoFa from '@/components/auth/DisableTwoFa';
function Settings() {
    const { profile } : any = useContext(ContextGlobal);
    return (
        <>
            <div className="flex items-center justify-center w-[300px] md:w-full ">
                <div className="flex flex-col items-center justify-center w-full  flex-1 px-3 md:px-20 text-center">
                    <div className="text-white font-bold md:text-[48px]">Settings: </div>
                    <PreAuthForm exit={false} />
                    <div className="bg-[#311251] drop-shadow-2xl w-[260px] md:w-[500px] bg-opacity-50 pb-10 rounded-2xl  flex items-center justify-center flex-col max-w-4xl">
                    <div className='text-white'>{profile?.twoFactorEnabled == true ?"2FA is enabled" : "2FA is disabled"} </div>
                        {
                            profile?.twoFactorEnabled == true ? <DisableTwoFa /> : ""
                        }
                    </div>
                    <div className="flex pt-5 items-center flex-col">
                        <div>
                            <img src="/pingsvg.svg" alt="42" className="overflow-hidden transition-all w-10" />
                        </div>
                        <div className="text-white">PingPong</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings
