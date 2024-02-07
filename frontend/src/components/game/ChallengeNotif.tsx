import React, { useContext } from "react";
// import GameSwiper from "./GameSwiper";
import OutsideClickHandler from "react-outside-click-handler";
import { useRouter } from "next/navigation";
import { Mode, modeAtom } from "./atoms";
import { useSetAtom } from "jotai";
import { ContextGlobal } from "@/context/contex";
import dynamic from "next/dynamic";
const GameSwiper = dynamic(() => import('./GameSwiper'), { ssr: false });


const ChallengeNotif = ( { openAl, gameId }: {openAl: any, gameId: string} ) => {

    const router = useRouter();
    const setMode = useSetAtom(modeAtom);
    const { socket } = useContext(ContextGlobal);

    const challenge = () => {
        setMode(Mode.challenge);
        router.push(`/dashboard/game/${gameId}`, { scroll: false });
    }

    const refuse = () => {
        socket?.emit("refuseChallenge", gameId);
    }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 z-50 flex justify-center items-center font-inter">
        <div className="w-[30%]  rounded-3xl shadow-lg font-light mx-2">
            <OutsideClickHandler onOutsideClick={openAl}>
                <div role="alert" className="alert bg-[#311150] flex">
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <h1  className="text-center" >Challenge</h1>
                            <GameSwiper />
                        </div>
                        <div className="justify-evenly flex">
                            <button className="btn btn-sm" onClick={() => {openAl(); refuse()}}>refuse</button>
                            <button className="btn btn-sm btn-primary" onClick={() => {openAl(); challenge();}}>Accept</button>
                        </div>
                    </div>
                </div>
            </OutsideClickHandler>
        </div>
    </div>
  )
}

export default ChallengeNotif