import React, { useState } from "react";
import GameSwiper from "./GameSwiper";
import OutsideClickHandler from "react-outside-click-handler";
import { useRouter } from "next/navigation";
import { isValidAccessToken } from '@/api/user/user';


function PlayPopup({ openAl }: { openAl: () => void}) {
    const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const createRoom = async () => {
        try {
			isValidAccessToken().then((res) => {
                if (res) {
                    setIsAuthenticated(true);
                } else {
                    router.push('/auth/login');
                }
            }).catch(() => {
                router.push('/auth/login');
            });
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
					<div role="alert" className="alert bg-transparent shadow-2xl border-0 flex">
						<div className="flex flex-col">
							<div className="mb-8 rounded-2xl backdrop-blur-md bg-[#311150]/50 w-full">
								<h1 className="text-center font-inter text-sm sm:text-xl p-4 text-[#ffffff]/80">Play Online</h1>
								<GameSwiper />
								<h1 className='text-center font-inter text-sm sm:text-xl p-4 text-[#ffffff]/80 '>
                        			How to play
								</h1>
								<div className='flex items-center justify-around text-white/80 p-4'>
									<div className="flex justify-center items-center mb-4 ">
										<p className="text-sm mr-2"> Press</p>
										<kbd className="kbd bg-[#811B77]/50 w-6 h-6">▲</kbd>
										<p className="text-sm ml-2"> to Move Up</p>
									</div>
									<div className="flex justify-center items-center mb-4 ">
										<p className="text-sm mr-2"> Press</p>
										<kbd className="kbd bg-[#811B77]/50 w-6 h-6 ">▼</kbd>
										<p className="text-sm ml-2"> to Move Down</p>
									</div>
								</div>
							</div>
							<div className="justify-evenly flex">
								<button className="btn w-32 h-10 font-inter text-white text-md bg-[#ffffff]/20" onClick={openAl}>
									Cancel
								</button>
								<button className="btn w-32 h-10 font-inter text-white text-md bg-[#811B77]/50" onClick={createRoom}>
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
