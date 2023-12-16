const Statistics = () => {
    return (
        <>
            <div className="text-white text-[24px] font-light w-full flex items-center justify-center pt-5">
                Statistics :
            </div>
            <div className="text-white text-[24px] px-3">
                <div className="flex w-full items-center justify-between">
                    <div>Matches</div>
                    <div>1000</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div>Wins</div>
                    <div>500</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div>Loses</div>
                    <div>400</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div>Draws</div>
                    <div>100</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div>Ratio</div>
                    <div>60%</div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div>Rank</div>
                    <div>#70</div>
                </div>
            </div>
        </>
    )
}

export default Statistics