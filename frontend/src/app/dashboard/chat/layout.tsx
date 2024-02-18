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
  const { setChatSocket, setChatRoomsToJoin, setChatRoomsJoined, friends, profile, chatSocket } = useContext(ContextGlobal);
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
      console.log('Connected to the server');
    };

    const handleDisconnect = () => {
      console.log('Disconnected from the server');
    };

    sock.on('connect', handleConnect);
    sock.on('disconnect', handleDisconnect);


    return () => {
      console.log("Cleanup: Disconnecting socket");
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
    }).catch((err) => { console.log(err) });
  }, [chatSocket]);

  useEffect(() => {
    if (profile && friends && chatSocket) {
      friends.forEach((friend) => {
        const friendId = friend.senderId === profile.id ? friend.receiverId : friend.senderId;
        getChatRoomByName(profile?.id.toString(), friendId.toString()).then((res) => {
          if (res && res.data && !privChat.find((room) => room.id === res.data.id))
            setPrivChat((prev) => [...prev, res.data]);
        }).catch((err) => { console.log(err) });
      });

      if (profile?.id > 0) {
        chatSocket.on('leaveRoom', ({ roomId, userId }: { roomId: number, userId: number }) => {
          if (profile && profile?.id > 0 && chatSocket.id && userId === profile?.id) {
            // console.log("Leaving room", roomId);
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
            // console.log('join-room-socket', res);
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
    <div className="border pb-4 w-full h-full bg-[#311251]/80 md:rounded-3xl rounded-t-md md:w-[95%] md:h-[95%] md:mt-6 md:overflow-auto md:mx-auto md:shadow-lg">
      <h1 className="text-white md:text-3xl text-lg md:font-bold text-center m-2 p-1 md:m-4 md:p-2 font-inter w-auto">
        Chat
      </h1>
      <div className="rounded-md mx-2 md:mx-6 flex justify-between items-center flex-wrap">
        <div className="flex flex-col justify-between bg-[#5D5959]/40 w-full md:w-[32%] md:rounded-3xl rounded-t-3xl p-2 shadow-lg md:h-[1030px] h-[800px] font-light">
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