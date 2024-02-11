import { ContextGlobal } from '@/context/contex';
import { ChatRoom, RoomVisibility } from '@/interfaces';
import { Key } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'

interface PopupProps {
  channel: ChatRoom
  setOpenChannel: React.Dispatch<React.SetStateAction<ChatRoom | null>>
  Handlepopup(): void
}

function JoinChannel({ channel, setOpenChannel, Handlepopup }: PopupProps) {
  const { chatSocket } = useContext(ContextGlobal);
  const [Validationerror, setValidationError] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });



  
    const handleNewMember = (e:any) => {
      e.preventDefault();
      if (channel.visibility !== RoomVisibility.PRIVATE) {
      const { password } = formData;
      const channelData = {
        name: channel.name,
        passwordHash: password,
      };
    chatSocket?.emit("new-member", channelData);
    setFormData({
        name: "",
        password: "",
      });
    } else {
      chatSocket?.emit("request-join-room", channel);
    }
      setValidationError(null);

     if (Handlepopup){
      Handlepopup();
     }
    };

    return (
      <>
        <div className=" fixed top-0 left-0 w-screen h-screen bg-[#000000]/50 z-50 flex justify-center items-center font-inter">
          <form onSubmit={handleNewMember}>
          <div className="bg-[#311150]/80 w-[550px] h-[200px] rounded-3xl shadow-lg font-light mx-2">
            <div className="flex justify-center items-center p-3">
              <h1 className="text-white md:text-lg">Join Channel {channel.name}</h1>
            </div>
            {channel.visibility === RoomVisibility.PROTECTED && <div className="flex justify-center items-center my-2 w-3/4 mx-auto text-black">
              <div className="relative w-[90%] h-full flex justify-center items-center bg-[#D9D9D9] rounded-lg">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-[90%] md:h-11 h-[36px] rounded-l-lg bg-[#D9D9D9] outline-none px-2 md:text-lg text-sm mr-2"
                  placeholder="Enter password"
                />
                <Key className="w-5 h-5 absolute right-2 text-gray-400" />
                <div className="w-[10%] mr-2 md:mr-0">
                </div>
              </div>
            </div>}
            <div className="flex justify-center items-center mt-4 text-sm">
              <div className="flex justify-between w-[67.5%]">
                <button onClick={() => setOpenChannel(null)} className="w-[100px] h-9 md:h-[40px] rounded-xl text-white hover:bg-[#811B77]/100 border">
                  Cancel
                </button>
                <button type="submit" className="bg-[#811B77] w-[100px] h-9 md:h-[40px] rounded-xl text-white hover:bg-[#811B77]/100 border">
                  Join
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default JoinChannel
