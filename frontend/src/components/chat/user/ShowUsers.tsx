import { Friendship } from "@/interfaces";
import UserItem from "./UserItem";

const ShowUsers = ({ friends }: { friends: Friendship[] }) => {

    return (
        <div className="w-full h-[100px] flex flex-row items-center overflow-x-auto">
            {friends.length > 0 ? friends.map((user, index) => (
                <UserItem key={index} friend={user} />
            )) :<div className="flex justify-center items-center mx-auto"><h1 className="text-white  md:text-2xl text-xl">You have no friends</h1></div>}
        </div>
    )
}

export default ShowUsers;