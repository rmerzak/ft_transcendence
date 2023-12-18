'use client'
import PreAuthForm from '@/components/auth/PreAuthForm'
import { ContextGlobal } from '@/context/contex';
import React, { useContext, useState } from 'react'

function Settings() {
    const { profile, updateUser } : any= useContext(ContextGlobal);
    const [code, setCode] = useState<string>("");
    return (
        <>
            <div className="flex flex-col items-center justify-center h-[calc(70%)]">
                <div className="flex flex-col items-center justify-center w-full flex-1 px-5 md:px-20 text-center">
                    <div className="text-white font-bold text-[48px]">Settings: </div>
                    <PreAuthForm exit={false} />
                    <div className='text-white'>
                        {profile?.twoFactorEnabled == true ? "2FA is enabled" : "2FA is disabled"}
                        {
                            profile?.twoFactorEnabled == true ? <form>
                                <div className="flex items-center bg-white mt-6 border-[0.063rem] rounded-[1rem] overflow-hidden relative ">
                                    <label htmlFor="name"></label>
                                    <input type="text" id="name" onChange={(e) => { setCode(e.currentTarget.value)}} placeholder="Two-factor authentication code" className="w-[20.438rem] h-[2.75rem] pl-[1.063rem] leading-normal" />

                                </div>
                                <div className="pt-5 flex items-center justify-between w-[20.438rem] h-[2.75rem]" style={{ marginBottom: "10px", marginTop: "10px" }}>
                                    <button type="submit" className="bg-[#79196F] w-[100px] h-[40px] text-white py-2 px-4 rounded-[10px]">Disable</button>
                                </div>

                            </form> : ""
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
