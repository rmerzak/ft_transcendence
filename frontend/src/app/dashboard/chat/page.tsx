import UserOnline from "@/components/chat/userOnline";
import Channels from "@/components/chat/channels";
import Message from "@/components/chat/msg";

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
        <div className="bg-[#5D5959]/40 w-[66%] text-white h-[1090px] rounded-3xl p-4 hidden md:block">
          <div>
            <div className="w-full flex justify-center items-center space-x-2">
              <span className="bg-orange-300 rounded-full h-3 w-3"></span>
              <h1 className="text-xl font-thin">User here</h1>
            </div>
            <div className="flex justify-center">
              <hr className="w-1/5" />
            </div>
          </div>
          <div className="flex justify-center my-3 bg-slate-400">
            <div>
              msg here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;
