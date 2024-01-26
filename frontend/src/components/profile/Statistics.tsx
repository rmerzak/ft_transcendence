'use client'

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ContextGlobal } from "@/context/contex";

const Statistics = () => {
    const [statistics, setStatistics] = useState<any>([]);
    const { profile }: any = useContext(ContextGlobal);



    async function name() {
        console.log(profile.id);
        const payload = {
            playerId: profile.id
        };
        await axios.post(`${process.env.API_BASE_URL}/api/statistics`, payload, 
        { withCredentials: true })
        .then(
            res => {
                console.log("yahya", res.data)
                setStatistics(res.data.statistics)
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
        
    return (
        <>
            <div className="text-gray-400 text-[19px] font-thin w-full flex items-center justify-center pt-5">
                Statistics</div>
                <div className="border-b border-gray-400 w-[50px] mx-auto mb-4"></div>
            <div className="text-[18px] px-4">
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Matches</div>
                    <div className="text-white text-opacity-50">{statistics.gameMatches}</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Wins</div>
                    <div className="text-white text-opacity-50">{statistics.gameWins}</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Loses</div>
                    <div className="text-white text-opacity-50">{statistics.gameLoses}</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Elo</div>
                    <div className="text-white text-opacity-50">{statistics.gameElo}</div>
                </div>
                </div>

        </>
    )
}

export default Statistics