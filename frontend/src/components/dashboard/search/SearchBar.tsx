'use client'
import axios from "axios";
import { Search } from "lucide-react"
import React, { useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce';
import Link from "next/link";

function SearchBar() {
    const [search, setSearch] = useState<string>('');
    const [searched, setSearched] = useState<any>([]);
    const [open, setOpen] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    async function searchProfile(search : string) {
        const response = await axios.get(`http://localhost:3000/users/search/${search}`,{withCredentials:true}).then((res) => {setSearched(res.data); console.log(res.data);});
        console.log("searched",searched);
    }
    const debouncedSearchBackend = useDebouncedCallback(searchProfile, 500);
    useEffect(() => {
        if (search) {
            debouncedSearchBackend(search);
        }
    }, [search, debouncedSearchBackend]);
    const handleBlur = (e:any) => {
        if (inputRef.current && !inputRef.current.contains(e.relatedTarget)) {
            setTimeout(() => {
                setOpen(false);
                setSearched([]);
                setSearch('');
              }, 200);
        }
    };
    return (
        <>
            <div>
                <div className="md:w-[500px]  flex items-center relative ">
                    <input type="text" placeholder="Search" onAuxClickCapture={() =>{setOpen(false),setSearched(null),setSearch('')}} onBlur={handleBlur} onMouseDown={() => { setOpen(true); }}
                        ref={(input) => { inputRef.current = input; }} onChange={(e) => {setSearch(e.target.value);setOpen(true)}} className="bg-navbar w-full text-white rounded p-2" />
                    <Search size={25} color="#ffff" className="  absolute right-0 pr-1" /> 
                </div>
                <div className="z-10 absolute bg-search rounded-b-lg">
                    {open && searched.map((user, index) => (
                            <Link key={index} href={`${process.env.API_FRONT_END}/dashboard/profile/${user.username}`} className=" w-[500px] text-white  p-2 flex items-center hover:bg-purple-300/50">
                                <img src={user.image} alt="" className="w-10 h-10 rounded-full" />
                                <p className="ml-2">{user.username}</p>
                            </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SearchBar
