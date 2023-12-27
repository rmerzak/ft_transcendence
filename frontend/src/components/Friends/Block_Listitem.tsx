import React from "react";
import { LockKeyhole } from 'lucide-react';

const Block_Listitem = ({pic, name} : {pic: string, name: string}) => {
    return (
        <div className="bg-black-list flex mx-3 mb-3  items-center">
            <div className="w-[10%] mx-2 my-1 rounded-full">
                   <img src={'/' + pic} alt="default pic" className="rounded-full"/>
                </div>
                <div className="text-gray-200 text-[15px] font-thin ">{name}</div>
                <button className="ml-auto mr-4"><LockKeyhole size={18} strokeWidth={2.5} color="#FFFFFF"/>
                </button>
            </div>
    )
}

export default Block_Listitem