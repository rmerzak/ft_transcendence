import UserOnline from "@/components/chat/userOnline";
import Channels from "@/components/chat/channels";
import Message  from "@/components/chat/msg";

const Chat = () => {
  return (
    <div className="bg-[#311251]/80 rounded-md w-[95%] h-[90%] mt-6 overflow-auto mx-auto shadow-lg">
      <h1 className="text-white text-2xl font-bold text-center m-4 p-2 ">
        Chat
      </h1>
      <div className="rounded-md mx-8 flex justify-between items-center">
      <div className="bg-[#5D5959]/40 w-[32%] rounded-3xl p-2 shadow-lg">
        <UserOnline />
        <Channels />
        <Message />
      </div>
      <div className="bg-[#5D5959]/40 w-[60%]">hello</div>
    </div>
    </div>
  );
};
export default Chat;