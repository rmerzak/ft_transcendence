import React from "react";
import GameSwiper from "./GameSwiper";
import OutsideClickHandler from "react-outside-click-handler";
import { useRouter } from "next/navigation";

function PlayPopup({ openAl }: { openAl: () => void}) {
    const router = useRouter();
	const createRoom = async () => {
        try {
            const res = await fetch(`${process.env.API_BASE_URL}/api/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await res.json();

            if (data.roomId)
                router.push(`/dashboard/game/${data.roomId}`, { scroll: false });
        } catch {}
    }

	return (
		<div className="fixed top-0 left-0 w-screen h-screen bg-black bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 z-50 flex justify-center items-center font-inter">
			<div className="w-[30%]  rounded-3xl shadow-lg font-light mx-2">
				<OutsideClickHandler onOutsideClick={openAl}>
					<div role="alert" className="alert bg-[#311150] flex">
						<div className="flex flex-col">
							<div className="mb-8">
								<h1 className="text-center">Play Online</h1>
								<GameSwiper />
							</div>
							<div className="justify-evenly flex">
								<button className="btn btn-sm w-20" onClick={openAl}>
									Cancel
								</button>
								<button className="btn btn-sm w-20 btn-primary" onClick={createRoom}>
									Play
								</button>
							</div>
						</div>
					</div>
				</OutsideClickHandler>
			</div>
		</div>
	);
}

export default PlayPopup
