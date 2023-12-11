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
        <div className="flex justify-center items-center">
            {msg.map((msg) => ()
                }
            <div className="bg-[#5D5959]/40 w-3/4 rounded-md text-white flex justify-between items-center">
                hello
            </div>
        </div>

)};
export default Msg;