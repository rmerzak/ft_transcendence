'use client';
import Channels from '@/components/chat/rooms/channels'
import UserOnline from '@/components/chat/user/userOnline'
import Recent from "@/components/chat/recent/recent";
import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ContextGlobal } from '@/context/contex';
import { getChatRoomByName, getChatRoomsJoined } from '@/api/chat/chat.api';
import { ChatRoom, ChatRoomMember } from '@/interfaces';
import { useRouter } from 'next/navigation';


const Layout = ({ children }: any) => {
  const { setChatSocket, setChatRoomsJoined, friends, profile, chatSocket } = useContext(ContextGlobal);
  const [privChat, setPrivChat] = useState<ChatRoom[]>([]);
  const router = useRouter();

  useEffect(() => {
    const sock = io(`${process.env.API_BASE_URL}/chat`, {
      autoConnect: false,
      withCredentials: true,
    });

    if (!sock.connected) {
      sock.connect();
    }
    const handleConnect = () => {
      setChatSocket(sock);

    };

    const handleDisconnect = () => {

    };

    sock.on('connect', handleConnect);
    sock.on('disconnect', handleDisconnect);


    return () => {
      sock.off('connect', handleConnect);
      sock.off('disconnect', handleDisconnect);
      sock.disconnect();
    };
  }, []);

  useEffect(() => {
    getChatRoomsJoined().then((res) => {
      if (res !== null && res.data !== null && res.data.length > 0) {
        setChatRoomsJoined(res.data);
        res.data.forEach((room: ChatRoom) => {
          if (chatSocket) {
            chatSocket.emit('join-room', { roomId: Number(room.id) });
          }
        });
      }
    }).catch((err) => {  });
  }, [chatSocket]);

  useEffect(() => {
    if (profile && friends && chatSocket) {
      friends.forEach((friend) => {
        const friendId = friend.senderId === profile.id ? friend.receiverId : friend.senderId;
        getChatRoomByName(profile?.id.toString(), friendId.toString()).then((res) => {
          if (res && res.data && !privChat.find((room) => room.id === res.data.id))
            setPrivChat((prev) => [...prev, res.data]);
        }).catch((err) => {  });
      });

      if (profile?.id > 0) {
        chatSocket.on('leaveRoom', ({ roomId, userId }: { roomId: number, userId: number }) => {
          if (profile && profile?.id > 0 && chatSocket.id && userId === profile?.id) {

            chatSocket.emit('leaveRoom', { roomId });
            router.push('/dashboard/chat');
          }
        });
        chatSocket.on('unban_from_room', (res: ChatRoomMember) => {
          if (res.userId === profile.id) {
            chatSocket.emit('join-room', { roomId: res.chatRoomId, test: 'test' });
          }
        });
        chatSocket.on('join-room-socket', (res: ChatRoomMember) => {
          if (res.userId === profile.id) {

            chatSocket.emit('join-room', { roomId: res.chatRoomId });
          }
        });
      }
      return () => {
        if (chatSocket) {
          chatSocket.off('leaveRoom');
          chatSocket.off('unban_from_room');
          chatSocket.off('join-room-socket');
        }
      }
    }
  }, [friends, profile, chatSocket]);
  return (
    <div className="pb-4 w-full h-full bg-[#311251]/80 md:rounded-3xl rounded-t-md md:w-[95%] mt-5 overflow-auto mx-auto md:shadow-lg">
      <h1 className="text-white md:text-3xl text-lg md:font-bold text-center m-2 p-1 md:m-4 md:p-2 font-inter w-auto">
        Chat
      </h1>
      <div className="md:h-[96%] h-[90%] rounded-md mx-2 md:mx-6 flex justify-between flex-wrap overflow-auto ">
        <div className="md:h-[96%] overflow-auto flex flex-col justify-between bg-[#5D5959]/40 w-full md:w-[32%] md:rounded-3xl rounded-t-3xl p-2 shadow-lg font-light">
          <UserOnline />
          <Channels />
          <Recent rooms={privChat} />
        </div >
        {children}
      </div>
    </div>
  )
}

export default Layout