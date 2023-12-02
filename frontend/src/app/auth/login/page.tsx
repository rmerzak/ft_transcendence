import Link from "next/link";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 login-gradient">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-5 md:px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl">
          <div className="flex items-center w-full md:w-3/5 p-5">
            <img src="/game.gif" alt="game" />
          </div>
          <div className="flex justify-center items-center flex-col w-full md:w-2/5 login-gradient text-white rounded-tr-2xl  rounded-br-2xl md:rounded-tr-2xl  py-5 md:py-36 px-5 md:px-12">
            <h2 className="text-3xl font-bold mb-2"> <span className="text-[#78196F]">Welcome</span>, Player!</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-5 md:mb-10">Serve up your ping pong journey! 🏓 #GameOn</p>
            {/* <a href="#" className="border-2 border-white rounded-full px-6 py-2 inline-block font-semibold hover:bg-white hover:text-green-500">
              Login
              </a> */}
            <Link href={`${process.env.API_BASE_URL}/auth/42`}className='flex justify-center items-center md:h-fit h-[30px] md:w-[150px] w-[100px] md:py-4 py-2 md:px-3 px-3 bg-[#25618b]  rounded-[32px] md:gap-[12px] gap-[8px]'>
              <img src="/42_logo.svg" alt="head" className='md:w-[24px] md:h-[24px] h-[20px] w-[20px] object-contain' />
              <span className='font-normal md:text-[16px] text-[10px] text-white'>LOGIN </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
