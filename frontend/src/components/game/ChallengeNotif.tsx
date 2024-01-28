import React, { useContext } from "react";
import GameSwiper from "./GameSwiper";
import OutsideClickHandler from "react-outside-click-handler";
import { useRouter } from "next/navigation";
import { Mode, modeAtom } from "./atoms";
import { useSetAtom } from "jotai";


const ChallengeNotif = ( { openAl, gameId }: {openAl: any, gameId: string} ) => {

    const router = useRouter();
    const setMode = useSetAtom(modeAtom);

    const challenge = () => {
        setMode(Mode.challenge);
        router.push(`/dashboard/game/${gameId}`, { scroll: false });
    }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 z-50 flex justify-center items-center font-inter">
        <div className="w-[30%]  rounded-3xl shadow-lg font-light mx-2">
            <OutsideClickHandler onOutsideClick={openAl}>
                <div role="alert" className="alert flex opacity-70">
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <h1  className="text-center" >Challenge</h1>
                            <GameSwiper />
                        </div>
                        <div className="justify-evenly flex">
                            <button className="btn btn-sm" onClick={openAl}>refuse</button>
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