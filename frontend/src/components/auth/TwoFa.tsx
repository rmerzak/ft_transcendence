"use client";

import { color } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
const TwoFa = () => {
    const [qrCodeImage, setQrCodeImage] = useState('');

    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth/2fa/generate', {
                    responseType: 'blob',
                    withCredentials: true, // Include credentials in the request
                });

                const imageUrl = URL.createObjectURL(response.data);
                setQrCodeImage(imageUrl);
            } catch (error) {
                console.error('Error fetching QR code:', error);
            }
        };

        fetchQrCode();
    }, []);


    return (
        <div className="bg-[#311251] drop-shadow-2xl w-[380px] md:w-[500px] bg-opacity-50 pb-10 rounded-2xl  flex items-center justify-center flex-col max-w-4xl">
            <div className="text-white text-[20px]" style={{marginBottom: "10px", marginTop: "10px"}}>Please scan the QR code below</div>
            <div>
                <img draggable="false" src={qrCodeImage} alt="" className="w-[200px]"/>
            </div>
            <div className="flex items-center bg-white mt-6 border-[0.063rem] rounded-[1rem] overflow-hidden relative ">
        <label htmlFor="name"></label>
        <input type="text" id="name" placeholder="code"  className="w-[20.438rem] h-[2.75rem] pl-[1.063rem] leading-normal" />
      </div>
      <div className="pt-5 flex items-center justify-between w-[20.438rem] h-[2.75rem]" style={{marginBottom: "10px", marginTop: "10px"}}>
        <button  className="bg-[#79196F]  w-[100px] h-[40px] text-white py-2 px-4 rounded-[10px] border-colors">Back</button>
        <button  className="bg-[#79196F] w-[100px] h-[40px] text-white py-2 px-4 rounded-[10px]">Continue</button>
      </div>

        </div>
    )
    
}

export default TwoFa