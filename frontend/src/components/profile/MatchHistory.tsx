'use client'
import React, { useState } from "react";
import { MatchHistoryItemInterface } from "@/interfaces";
import MatchHistoryItem from "./MatchHistoryItem";

const MatchHistory = ({ data, head }: { data: MatchHistoryItemInterface[]; head: string[] }) => {
    const itemsPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

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

    return (
        <>
            <div className="flex items-center justify-between h-[40px] bg-head text-white">
                {head.map((item, index) => (
                    <div className="w-1/2 flex items-center justify-center" key={index}>
                        {item}
                    </div>
                ))}
            </div>
            {currentData.map((item, index) => (
                <MatchHistoryItem
                    key={index}
                    playerOne={item.PlayerOne}
                    playerTwo={item.PlayerTwo}
                    ImgPlayerOne={item.ImgPlayerOne}
                    ImgPlayerTwo={item.ImgPlayerTwo}
                    result={`${item.ScorePlayerOne}-${item.ScorePlayerTwo}`}
                />
            ))}
            <div className="pagination flex items-center justify-center text-white">{renderPageNumbers()}</div>
        </>
    );
};

export default MatchHistory;
