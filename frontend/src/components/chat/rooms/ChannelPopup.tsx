"use client";
import { ContextGlobal } from "@/context/contex";
import React, { FormEvent, useContext, useState } from "react";

interface PopupProps {
    setChannel: () => void;
}

const ChannelPopup = ({ setChannel }: PopupProps) =>  {
    const [isVisible, setIsVisible] = useState(false);

    const handleToggleModal = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div>
            <input type="checkbox" id="my-modal-6" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Create Channel</h3>
                    <form>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Channel Name</span>
                            </label>
                            <input type="text" placeholder="Channel Name" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="text" placeholder="Password" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Visibility</span>
                            </label>
                            <select className="select select-bordered">
                                <option disabled selected>PUBLIC</option>
                                <option>PRIVATE</option>
                            </select>
                        </div>
                        <div className="modal-action">
                            <label htmlFor="my-modal-6" className="btn btn-primary">Create</label>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChannelPopup

