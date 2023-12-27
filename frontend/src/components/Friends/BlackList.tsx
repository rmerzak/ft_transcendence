"use client";
import React, { useState } from "react";
import { LockKeyhole } from 'lucide-react';
import Block_Listitem from "./Block_Listitem";

export const BlackList = () => {


    return (
        <div  className="text-gray-400 pb-6 bg-achievements md:w-[24%] h-full md:mt-2 mt-2">
            <div className="pb-1 text-gray-300 text-[15px] font-thin w-full flex items-center justify-center pt-2">Black List</div>
            <div className="border-b border-gray-200 w-[30px] mx-auto mb-7"></div>

            <Block_Listitem pic="mberri.png" name="UserGuest"/>
            <Block_Listitem pic="people-01.png" name="UserGuest"/>
            <Block_Listitem pic="dfpic.png" name="UserGuest"/>
            <Block_Listitem pic="people-02.png" name="UserGuest"/>
            <Block_Listitem pic="people-03.png" name="UserGuest"/>
            <Block_Listitem pic="dfpic.png" name="UserGuest"/>
            <Block_Listitem pic="dfpic.png" name="UserGuest"/>
            <Block_Listitem pic="people-03.png" name="UserGuest"/>
        </div>
    )
}

export default BlackList