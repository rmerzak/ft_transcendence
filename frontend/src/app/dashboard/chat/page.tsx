import UserOnline from "@/components/chat/userOnline";
import Channels from "@/components/chat/channels";
import Message from "@/components/chat/msg";
import MsgShow from "@/components/chat/msgshow";

const Chat = () => {
  return (
    <div className="w-full bg-[#311251]/80 md:rounded-3xl rounded-t-md md:w-[95%] md:h-[90%] md:mt-6 md:overflow-auto md:mx-auto md:shadow-lg">
      <h1 className="text-white md:text-2xl text-lg md:font-bold text-center m-2 p-1 md:m-4 md:p-2 font-inter w-full">
        Chat
      </h1>
      <div className="rounded-md mx-2 md:mx-8 flex justify-between items-center">
        {/* user online here*/}
        <div className="bg-[#5D5959]/40 w-full md:w-[32%] md:rounded-3xl rounded-t-3xl p-2 shadow-lg h-full font-light">
          <UserOnline />
          <Channels />
          <Message />
        </div>
        {/* message show here */}
        <MsgShow />
      </div>
    </div>
  );
};
export default Chat;
