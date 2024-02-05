'use client'
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MatchHistoryItemInterface } from "@/interfaces";
import MatchHistoryItem from "./MatchHistoryItem";
import { ContextGlobal } from "@/context/contex";
import { useRouter } from "next/navigation";

const MatchHistory = ({ data, head }: { data: MatchHistoryItemInterface[]; head: string[] }) => {
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const { profile }: any = useContext(ContextGlobal);
    const router = useRouter();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [currentData, setCurrentData] = useState([]);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const [match, setMatch] = useState<any>([]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    async function name() {
        // console.log(profile.id);
        const payload = {
            playerId: profile.id
        };
        await axios.post(`${process.env.API_BASE_URL}/api/match-history`, payload, 
        { withCredentials: true })
        .then(
            res => {
                console.log(res.data)
                setMatch(res.data.matchHistory)
                console.log("Fetched matches:", res.data.matchHistory);

            }
            )
            .catch(
                err => {
                    console.log(err)
                }
        )
    }

    useEffect( () => {

        if (profile.id != -1)  
            name();

    }, [profile.id]);
        // console.log(match)
    const redirectToAnotherPage = () => {
        router.push('/dashboard/game');
    };
    const renderPageNumbers = () => {
        if (totalPages <= 3) {

            return null;
        }
        const pageNumbers = [];
        const maxVisiblePages = 2;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - Math.floor(maxVisiblePages / 2) &&
                    i <= currentPage + Math.floor(maxVisiblePages / 2))
            ) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`${currentPage === i ? "active" : ""} px-2 mx-2 rounded-full bg-[#401865] hover:bg-[#5f3a9f]`}
                    >
                        {i}
                    </button>
                );
            } else if (
                (currentPage - Math.floor(maxVisiblePages / 2) > 2 && i === currentPage - Math.floor(maxVisiblePages / 2)) ||
                (currentPage + Math.floor(maxVisiblePages / 2) < totalPages - 1 && i === currentPage + Math.floor(maxVisiblePages / 2))
            ) {
                pageNumbers.push(<span key={i}>...</span>);
            }
        }

        return pageNumbers;
    }; 


    const renderMatchItems = () => {
        const reversedMatches = match.slice().reverse();

        if (reversedMatches.length === 0) {
            return (
                <>
                <div className='flex items-center w-full h-[60px] bg-achievements3 my-2 text-white pb-1'>
                    <div className='flex items-center justify-center w-[100%] h-[60px] text-[12px] md:text-[16px] mt-2'>
                        {"NO MATCHES HISTORY"}
                    </div>
                </div>
                <div className="flex justify-center text-gray-300 mb-4">
                <button onClick={redirectToAnotherPage} className="bg-achievements2 w-[26%] py-1 border">
                    play</button>
                </div>
                </>
            );
        }

        
        <>
                <div className="flex items-center justify-between h-[40px] bg-head text-white text-[14px] md:text-[16px]">
                    {head.map((item, index) => (
                        <div className="w-1/2 flex items-center justify-center" key={index}>
                            {item}
                        </div>
                    ))}
                </div>
                <div className="pagination flex items-center justify-center text-white bg-achievements3">{renderPageNumbers()}</div>
        </>
        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        return reversedMatches.slice(startIdx, endIdx).map((item: any, index: any) => (
            <MatchHistoryItem
                key={index}
                playerOne={item.opponent.username}
                playerTwo={item.user.username}
                ImgPlayerOne={item.opponent.image}
                ImgPlayerTwo={item.user.image}
                result={`${item.oppScore}-${item.userScore}`}
                
            />

        ));
    };

    return (
        <>
            {renderMatchItems()}
            {/* <div className="pagination flex items-center justify-center text-white bg-achievements3">{renderPageNumbers()}</div> */}
        </>
    );
};

export default MatchHistory;