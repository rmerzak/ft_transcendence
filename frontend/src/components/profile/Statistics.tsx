import { ContextGlobal } from '@/context/contex';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

type StatisticsEntry = {
    gameElo: number;
    gameWins: number;
    gameLoses: number;
    gameMatches: number;
    gameRank: number;
}

const Statistics = () => {

    const { profile }: any = useContext(ContextGlobal);
    const [statistics, setStatistics] = useState<StatisticsEntry>({
        gameElo: 0,
        gameWins: 0,
        gameLoses: 0,
        gameMatches: 0,
        gameRank: 0,
    });
    const profileName = usePathname().split("/")[3];

    const fetchStatistics = async (username: string) => {
        // fetch statistics
        try {
            const req = await fetch(`${process.env.API_BASE_URL}/api/statistics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ playerName: username }),
            });
            const data = await req.json();
            setStatistics(data.statistics);
        } catch {}
    }

    useEffect(() => {
        if (profile.id !== -1) {
            fetchStatistics(profileName || profile.username);
        }
    }, [profile.id]);

    return (
        <>
            <div className="text-gray-400 text-[19px] font-thin w-full flex items-center justify-center pt-5">
                Statistics</div>
                <div className="border-b border-gray-400 w-[50px] mx-auto mb-4"></div>
            <div className="text-[18px] px-4">
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Matches</div>
                    <div className="text-white text-opacity-50">{statistics?.gameMatches}</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Wins</div>
                    <div className="text-white text-opacity-50">{statistics?.gameWins}</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Loses</div>
                    <div className="text-white text-opacity-50">{statistics?.gameLoses}</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Score</div>
                    <div className="text-white text-opacity-50">{statistics?.gameElo}</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Rank</div>
                    <div className="text-white text-opacity-50">#{statistics?.gameRank !== 0 ? statistics?.gameRank : '?'}</div>
                </div>
            </div>
        </>
    )
}

export default Statistics