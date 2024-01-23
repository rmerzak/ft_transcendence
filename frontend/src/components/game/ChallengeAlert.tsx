import React, { useContext } from "react";
import GameSwiper from "./GameSwiper";
import OutsideClickHandler from "react-outside-click-handler";
import { ContextGlobal } from "@/context/contex";
import { useRouter } from "next/navigation";


const ChallengeAlert = ( { openAl, playerId }: {openAl: any, playerId: number} ) => {

    const router = useRouter();
    const createChallengeRoom = async () => {
        try {
            const res = await fetch(`${process.env.API_BASE_URL}/api/rooms-challenge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ playerId: playerId }),
            });
            const data = await res.json();

            if (data.roomId)
                router.push(`/dashboard/game/${data.roomId}`, { scroll: false });
        } catch {}
    }

    const {  socket  } : any = useContext(ContextGlobal);

    const challenge = () => {
        // socket?.emit('challengeGame', playerId);
        createChallengeRoom();
    }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000]/50 z-50 flex justify-center items-center font-inter">
        <div className="bg-[#311150]/80 w-[30%]  rounded-3xl shadow-lg font-light mx-2">
            <OutsideClickHandler onOutsideClick={openAl}>
                <div role="alert" className="alert flex opacity-70">
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <h1  className="text-center" >Challenge</h1>
                            <GameSwiper />
                        </div>
                        <div className="justify-evenly flex">
                            <button className="btn btn-sm" onClick={openAl}>Cancel</button>
                            <button className="btn btn-sm btn-primary" onClick={challenge}>Challenge</button>
                        </div>
                    </div>
                </div>
            </OutsideClickHandler>
        </div>
    </div>
  )
}

export default ChallengeAlert