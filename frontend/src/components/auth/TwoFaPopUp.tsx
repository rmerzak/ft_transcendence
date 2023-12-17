"use client";

import axios from "axios";
import { LockKeyhole, User, XSquare } from "lucide-react";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
const TwoFaPopUp = ({ open, onClose, image,secret }: any) => {
    const [code, setCode] = useState<string>("");
    async function handleSubmit(event: any) {
        event.preventDefault();
        const response = await axios.post('http://localhost:3000/auth/2fa/verify', {code: code, secret: secret}, {
            withCredentials: true,
        });
        console.log(response);
        if (response.data === true) {
            onClose();
        }
    }
    if (!open) return null;
    return (
        <>
            <div id="popup-modal" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button onClick={onClose} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                            <XSquare color="red" />
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <div className="text-[16px] text-black font-bold">Please scan the QR code below</div>
                            <QRCode size={25} style={{ height: "50%", maxWidth: "50%", width: "50%" }} className="w-50 h-50 mx-auto" value={image} viewBox={`0 0 256 256`} />
                            <form onSubmit={handleSubmit}>
                                <div className="flex items-center bg-white mt-6 rounded-[1rem]  relative ">
                                <label htmlFor="code" className="hidden">Code:</label>
                                    <input onChange={(e) => { setCode(e.target.value); }} type="text" id="code" placeholder="code" className=" w-[20.438rem] h-[2.75rem] pl-[1.063rem] leading-normal" />
                                    <LockKeyhole className=" border absolute right-3" />
                                </div>
                                <div className="flex justify-between pt-3">
                                    <button onClick={onClose} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                                    <button type="submit" data-modal-hide="popup-modal" className="text-white bg-[#79196F] hover:bg-[#a6419c] focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center ">
                                        Yes, Activate
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default TwoFaPopUp