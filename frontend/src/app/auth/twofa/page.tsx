"use client";
import PreAuthForm from "@/components/auth/PreAuthForm";
import TwoFa from "@/components/auth/TwoFa";
const Verify = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 login-gradient">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-5 md:px-20 text-center">
        <div className="text-white font-bold text-[48px]">Two Authentication Factor</div>
        <TwoFa />
        <div className="flex pt-5 items-center flex-col">
          <div>
            <img  src="/pingsvg.svg" alt="42" className="overflow-hidden transition-all w-10" />
          </div>
          <div className="text-white">PingPong</div>
        </div>
      </div>

    </div>
  );
};

export default Verify;