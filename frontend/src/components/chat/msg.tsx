'use client';

import { m } from "framer-motion";

const msg = [
    {name: 'user1', avatar:"/user" ,msg: 'slam alikom'},
    {name: 'user2', avatar:"/user" ,msg: 'slam alikom'},
    {name: 'user3', avatar:"/user" ,msg: 'slam alikom'},
    {name: 'user4', avatar:"/user" ,msg: 'slam alikom'},
]

const Msg = () => {
    return (
        <div className="mx-auto w-3/4 scroll-y-auto max-h-[108px]">
            {msg.map((msg) => (
            <div key={msg.name} className="bg-[#5D5959]/40 rounded-md my-2 text-white flex justify-between items-center">
                hello
            </div>
            ))}
        </div>

)};
export default Msg;