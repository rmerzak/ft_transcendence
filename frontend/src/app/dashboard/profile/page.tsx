
import ProfileInformation from "@/components/profile/ProfileInformation"
import MatchHistory from "@/components/profile/MatchHistory"
import Achievements from "@/components/profile/Achievements"
import Statistics from "@/components/profile/Statistics"
const Profile = () => {
  return (
    <>
    <div>
    <ProfileInformation />
    <MatchHistory />
    <Achievements />
    <Statistics />
    </div>
    </>
  )
}

export default Profile