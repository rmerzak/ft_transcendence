const Statistics = () => {
    return (
        <>
            <div className="text-gray-400 text-[19px] font-thin w-full flex items-center justify-center pt-5">
                Statistics</div>
                <div className="border-b border-gray-400 w-[50px] mx-auto mb-4"></div>
            <div className="text-[18px] px-4">
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Matches</div>
                    <div className="text-white text-opacity-50">1000</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Wins</div>
                    <div className="text-white text-opacity-50">500</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Loses</div>
                    <div className="text-white text-opacity-50">400</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Draws</div>
                    <div className="text-white text-opacity-50">100</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Ratio</div>
                    <div className="text-white text-opacity-50">60%</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="text-white font-thin">Rank</div>
                    <div className="text-white text-opacity-50">#70</div>
                </div>
            </div>
        </>
    )
}

export default Statistics