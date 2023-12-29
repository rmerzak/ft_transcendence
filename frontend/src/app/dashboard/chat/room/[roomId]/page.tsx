'use client'

import { useParams } from 'next/navigation'

const Room = () => {
  const {roomId} = useParams()
  return (
    <div>
      <h1 className='text-white'>Room {roomId}</h1>
      {/* Your room content goes here */}
    </div>
  );
};

export default Room;