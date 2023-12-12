"use client";

import axios from "axios";
import { XSquare } from "lucide-react";
import { useEffect, useState } from "react";

const TwoFaPopUp = ({open, onClose, image } :any) => {


        const fetchQrCode = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth/2fa/generate', {
                    responseType: 'blob',
                    withCredentials: true,
                });

                const imageUrl = URL.createObjectURL(response.data);
                setQrCodeImage(imageUrl);
            } catch (error) {
                console.error('Error fetching QR code:', error);
            }
        };
    if(!open) return null;
    //if(open) fetchQrCode();
    return (
        <>
            <div id="popup-modal" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button onClick={onClose}  type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                         <XSquare color="red"/>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <img src={image} className="w-50 h-50 mx-auto" alt="Confirm modal" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                            <button data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                                Yes, I'm sure
                            </button>
                            <button onClick={onClose}  data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default TwoFaPopUp