'use client';
import { useContext, useEffect, useState } from 'react';
import Chat from './chat';
import Chatheader from './chatHeader';
import Sendchatmsg from './sendchatmsg';
import { Blocker, ChatRoomUsers, Messages } from '@/interfaces';
import { ContextGlobal } from '@/context/contex';
import { getChatRoomMembers } from '@/api/chat/chat.api';
import { getFriendList } from '@/api/friendship/friendship.api';

interface MsgShowProps {
  messages?: Messages[];
  chatId: number;
}

interface State {
  username: string;
  friendId: number | undefined;
  status: string;
  isblock: boolean;
  blockByMe?: number
  chatRoomMembers: ChatRoomUsers[];
}

const MsgShow: React.FC<MsgShowProps> = ({ messages, chatId }) => {
  const { profile, friends, socket, setFriends } = useContext(ContextGlobal);
  const [state, setState] = useState<State>({
    username: '',
    friendId: 0,
    status: '',
    isblock: false,
    blockByMe: 0,
    chatRoomMembers: [],
  });

  function getFriends() {
    getFriendList().then((res) => {
      if (res?.data && res?.data?.length > 0) {
        setFriends(res?.data);
      }
    })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    if (chatId) {
      getChatRoomMembers(chatId).then((res) => {
        if (res?.data && Array.isArray(res?.data) && res?.data?.length > 0)
          setState(prevState => ({ ...prevState, chatRoomMembers: res.data }));
      });
    }
  }, [chatId]);

  useEffect(() => {
    if (socket) {
      socket.on('blockFriendChat', (data: { isblock: boolean, blockByMe: number }) => {
        if (data)
          setState(prevState => ({ ...prevState, isblock: data.isblock, blockByMe: data.blockByMe }));
      });
      socket.on('unblockFriendChat', (data: { isblock: boolean, blockByMe: number }) => {
        if (data)
          setState(prevState => ({ ...prevState, isblock: data.isblock, blockByMe: data.blockByMe }));
      });
      socket?.on('AcceptRequest', () => {
        getFriends();
      });
      socket?.on('friendAcceptRequest', () => {
        getFriends();
      });
      socket?.on('removeFriend', () => {
        getFriends();
      });
    }
    return () => {
      if (socket) {
        socket.off('blockFriendChat');
        socket.off('unblockFriendChat');
        socket.off('AcceptRequest');
        socket.off('friendAcceptRequest');
        socket.off('removeFriend');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (state.chatRoomMembers.length > 0 && profile && profile?.id > 0 && friends) {
      const targetMembers = state.chatRoomMembers.find((member) => member.user.id !== profile?.id);
      if (targetMembers) {
        const friendship = friends?.find((friend) => friend.receiver.id === targetMembers.user.id || friend.sender.id === targetMembers.user.id);
        if (friendship === undefined || friendship.status === 'PENDING')
          setState(prevState => ({ ...prevState, blockByMe: undefined }));
        else if (friendship && friendship.block) {
          if (friendship.blockBy === Blocker.SENDER && friendship.sender.id === profile?.id) {
            setState(prevState => ({ ...prevState, isblock: true, blockByMe: profile?.id }));
          } else if (friendship.blockBy === Blocker.RECEIVER && friendship.receiver.id === profile?.id) {
            setState(prevState => ({ ...prevState, isblock: true, blockByMe: profile?.id }));
          } else {
            setState(prevState => ({ ...prevState, isblock: true, blockByMe: targetMembers.user.id }));
          }
        } else {
          setState(prevState => ({ ...prevState, isblock: false, blockByMe: 0 }));
        }
        setState(prevState => ({
          ...prevState,
          username: targetMembers.user.username,
          status: targetMembers.user.status,
          friendId: friendship === undefined || friendship.status === 'PENDING' ? undefined : targetMembers.user.id,
          // friendId: targetMembers.user.id,
        }));
      }
    }
  }, [state.chatRoomMembers, profile?.id, friends]);

  return (
    <>
      <div className="bg-[#5D5959]/40 md:w-[66%] w-full mx-auto  text-white md:h-[1030px] h-[500px] md:rounded-3xl p-4 md:block md:mt-0 my-2">
        <Chatheader username={state.username} status={state.status} userId={state.friendId} friendBlock={state.isblock} blockByMe={state.blockByMe} />
        <div className='mt-4 md:h-[88%] h-[80%]'>
          <Chat messages={messages} />
        </div>
        <Sendchatmsg chatRoomId={chatId} isblocked={state.isblock} friendId={state.friendId} />
      </div>
    </>
  )
};
export default MsgShow;
