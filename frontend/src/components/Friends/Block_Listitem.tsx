import React from "react";
import { LockKeyhole } from 'lucide-react';

const Block_Listitem = ({pic, name} : {pic: string, name: string}) => {
    return (
        <div className="bg-black-list flex mx-2 items-center px-1">
            <div className="w-[14%] my-1 rounded-full">
                   <img src={'/' + pic} alt="default pic" className="rounded-full"/>
                </div>
                <div className="text-gray-200 text-[15px] font-thin">{name}</div>
                <button className="ml-auto md:mr-0 mr-2"><LockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF"/>
                </button>
            </div>
    )
}

export default Block_Listitem