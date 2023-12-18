'use client'
import { Search } from "lucide-react"
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce';

function SearchBar() {
    const [search, setSearch] = useState<string>('');
    function searchProfile(search : string) {
        
    }
    const debouncedSearchBackend = useDebouncedCallback(searchProfile, 500);
    useEffect(() => {
        if (search) {
            console.log(search);
            debouncedSearchBackend(search);
        }
    }, [search, debouncedSearchBackend]);
    return (
        <>
            <div>
                <div className="md:w-[500px]  border flex items-center relative ">
                    <input type="text" placeholder="Search" onChange={(e) => {setSearch(e.target.value)}} className="bg-navbar w-full text-white rounded p-2" />
                    <Search size={25} color="#ffff" className="  absolute right-0 pr-1" />
                </div>
                <div className="z-10 absolute">
                </div>
            </div>
        </>
    )
}

export default SearchBar
