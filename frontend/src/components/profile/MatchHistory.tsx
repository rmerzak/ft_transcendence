'use client'
import React, { useContext, useEffect, useState } from "react";
import { MatchHistoryItemInterface } from "@/interfaces";
import MatchHistoryItem from "./MatchHistoryItem";
import { ContextGlobal } from "@/context/contex";
import Loading from "../game/Loading";
import { usePathname } from "next/navigation";
import PlayPopup from "../game/PlayPopup";

type MatchHistoryEntry = {
    userPlayerId: number;
    userOpponentId: number;
    userScore: number;
    oppScore: number;
    user: {
        username: string;
        image: string;
    },
    opponent: {
        username: string;
        image: string;
    }
};

const MatchHistory = ({ data, head}: { data: MatchHistoryItemInterface[]; head: string[];}) => {
    const { profile }: any = useContext(ContextGlobal);
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [openAl, setOpenAl] = useState<boolean>(false);
    const [currentData, setCurrentData] = useState<[MatchHistoryEntry]>([
        {
            userPlayerId: 0,
            userOpponentId: 0,
            userScore: 0,
            oppScore: 0,
            user: {
                username: "user",
                image: "/avatar.jpeg"
            },
            opponent: {
                username: "opponent",
                image: "/avatar.jpeg"
            }
        }
    ]);

    const profileName = usePathname().split("/")[3];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // let currentData = data.slice(startIndex, endIndex);


    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderPageNumbers = () => {
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

    const fetchMatchHistory = async (username: string) => {
        // fetch match history
        try {
            setLoading(true);
            const req = await fetch(`${process.env.API_BASE_URL}/api/match-history`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ playerName: username}),
            });
            const data = await req.json();
            setCurrentData(data.matchHistory);
        } catch {}
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (profile.id !== -1) {
            fetchMatchHistory(profileName || profile.username);
        }
    }, [profile.id, currentData.length]);

    return (
        <>
            { openAl && <PlayPopup openAl={() => setOpenAl(!openAl)} />}
            <Loading isLoading={loading} />
            {currentData.length > 0 ? <div className="flex items-center justify-between h-[40px] bg-head text-white text-[14px] md:text-[16px]">
                {head.map((item, index) => (
                    <div className="w-1/2 flex items-center justify-center" key={index}>
                        {item}
                    </div>
                ))}
            </div> : null}
            {
                currentData.length > 0 ? ( currentData.map((item, index) => (
                    <MatchHistoryItem
                        key={index}
                        playerOne={item.user.username}
                        playerTwo={item.opponent.username}
                        ImgPlayerOne={item.user.image}
                        ImgPlayerTwo={item.opponent.image}
                        result={`${item.userScore}-${item.oppScore}`}
                    />
                )) 
            ) : ( 
            <div className="flex flex-col items-center">
                {profile.username === profileName || profileName === undefined ? (
                <>
                    <h1 className="text-white font-inter text-3xl text-center mt-10"><span className="text-[#BC51BE]">Play</span> to save the history</h1>
                    <button onClick={() => setOpenAl(!openAl)} className='btn mt-5 w-32 text-white bg-[#BC51BE]/50'>
                        Play
                    </button>
                </>
                ) : (
                    <h1 className="text-white font-inter text-3xl text-center mt-10">No match history found</h1> 
                )}
            </div>
            )}
            {/* <div className="pagination flex items-center justify-center text-white bg-achievements3">{renderPageNumbers()}</div> */}
        </>
    );
};

export default MatchHistory;
