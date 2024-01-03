'user client'
import React from 'react'

const Chatheader = () => {
    return (
        <>
            <div>
                <div className="flex">
                    <div className="w-full flex justify-center items-center space-x-2">
                        <span className="bg-orange-300 rounded-full h-3 w-3"></span>
                        <h1 className="text-xl font-thin">User here</h1>
                    </div>
                    <div className="">
                        {/* image messages parrametres */}
                        <button>
                            <svg
                                className="h-8 w-8"
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M16 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zM6 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zM26 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"
                                    fill="#ffffff"
                                    className=""
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <hr className="w-1/5" />
                </div>
            </div>
        </>
    );
};

export default Chatheader;