
import ProfileInformation from "@/components/profile/ProfileInformation"
import MatchHistory from "@/components/profile/MatchHistory"
import Achievements from "@/components/profile/Achievements"
import Statistics from "@/components/profile/Statistics"
import { data } from "@/data/MatchHistory"
const Profile = () => {
  return (
    <>
    {/* <div>
      <div className="h-[200px]">
      </div>
      <MatchHistory />

    </div> */}

    <div className="py-8 mx-2">
      <div className="w-full h-[250px] bg-mberri border-spacing-1 border-[#ffff]">
    {/* <ProfileInformation /> */}
      </div>
      <div className="flex md:flex-row flex-col">
        <div className="w-[33.33%] h-full bg-indigo-500">
        <Achievements />
        <Statistics />
        </div>
        <div className=" md:w-[66.33%]">
        <MatchHistory data={data} head={["Player","Result","Opponents"]}/>
        </div>
      </div>
    </div>
    </>
  )
}

export default Profile