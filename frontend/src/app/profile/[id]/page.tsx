"use client";
import { useParams } from "next/navigation";
function ProfileID() {
    const Parms = useParams();
    console.log(Parms)
  return (<>
    <div>
      ProfileID Page 
    </div></>
  )
}

export default ProfileID