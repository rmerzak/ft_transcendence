
import { MatchHistoryItemInterface } from "@/interfaces"
import { table } from "console"
import MatchHistoryItem from "./MatchHistoryItem"
const MatchHistory = ({ data, head }: { data: MatchHistoryItemInterface[], head: string[] }) => {
    return (
        <>
            <div className="flex items-center justify-between h-[40px] bg-head text-white">
                {head.map((item, index) => <div className=" w-1/2 flex items-center justify-center" key={index}>{item}</div>)}
            </div>
            {data.map((item, index) => {
                return (
                    <MatchHistoryItem key={index} playerOne={item.PlayerOne} playerTwo={item.PlayerTwo} ImgPlayerOne={item.ImgPlayerOne} ImgPlayerTwo={item.ImgPlayerTwo} result={`${item.ScorePlayerOne}-${item.ScorePlayerTwo}`}/>
                )
            })}

        </>
    )
}

export default MatchHistory