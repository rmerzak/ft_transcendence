'use client'

import { ContextGlobal } from "@/context/contex";
import { useContext } from "react";

const Home = () => {
    const { profile, setProfile } : any = useContext(ContextGlobal);
    return (
      <div>
        Home {profile?.username}
      </div>
    )
  }
  
  export default Home