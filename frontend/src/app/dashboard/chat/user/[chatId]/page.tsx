'use client'
import { useParams } from 'next/navigation'

const Chat = () => {
  const {chatId} = useParams()
  

  return (
    <div>
      <h1 className='text-white'>Chat User 3adi Id= {chatId}</h1>
      {/* Your Chat content goes here */}
    </div>
  );
};

export default Chat;