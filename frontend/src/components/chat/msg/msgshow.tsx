'use client';
import { use, useContext, useEffect, useState } from 'react';
// import { Message, ChatRoomUsers } from 'postcss';
import Chat from './chat';
import Chatheader from './chatHeader';
import Sendchatmsg from './sendchatmsg';
import { Blocker, ChatRoomUsers, Messages } from '@/interfaces';
import { ContextGlobal } from '@/context/contex';
import { getChatRoomMembers } from '@/api/chat/chat.api';

interface MsgShowProps {
  messages?: Messages[];
  chatId: number;
  error?: string;
}

interface State {
  username: string;
  friendId: number;
  status: string;
  isblock: boolean;
  chatRoomMembers: ChatRoomUsers[];
}

const MsgShow: React.FC<MsgShowProps> = ({ messages, chatId, error }) => {
  const { profile, friends } = useContext(ContextGlobal);
  const [state, setState] = useState<State>({
    username: '',
    friendId: 0,
    status: '',
    isblock: false,
    chatRoomMembers: [],
  });

  useEffect(() => {
    if (chatId) {
      getChatRoomMembers(chatId).then((res) => {
        setState(prevState => ({ ...prevState, chatRoomMembers: res.data }));
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [chatId]);

  useEffect(() => {
    const targetMembers = state.chatRoomMembers.find((member) => member.user.id !== profile?.id);
    if (targetMembers) {
      const isblock = friends?.find((friend) => friend.receiver.id === targetMembers.user.id || friend.sender.id === targetMembers.user.id)?.block;
      setState(prevState => ({
        ...prevState,
        username: targetMembers.user.username,
        status: targetMembers.user.status,
        friendId: targetMembers.user.id,
        isblock: isblock ? isblock : false,
      }));
    }
  }, [state.chatRoomMembers, profile, friends]);

  return (
    <>
      <div className="bg-[#5D5959]/40 w-[66%] text-white h-[1030px] rounded-3xl p-4 hidden md:block">
        {error === '' ? (
          <>
            <Chatheader username={state.username} status={state.status} userId={state.friendId} friendBlock={state.isblock} />
            <div className='mt-6 h-[88%]'>
              <Chat messages={messages} />
            </div>
            <Sendchatmsg chatRoomId={chatId} isblocked={state.isblock} friendId={state.friendId} />
          </>
        ) : (
          <div className="flex justify-center items-center h-full text-2xl">
            <p>
              {error}
            </p>
          </div>
        )}
      </div>
    </>
  )
};
export default MsgShow;


// 'use client';
// import { use, useContext, useEffect, useState } from 'react';
// import Chat from './chat';
// import Chatheader from './chatHeader';
// import Sendchatmsg from './sendchatmsg';
// import { Blocker, ChatRoomUsers, Messages } from '@/interfaces';
// import { ContextGlobal } from '@/context/contex';
// import { getChatRoomMembers } from '@/api/chat/chat.api';

// interface MsgShowProps {
//   messages?: Messages[];
//   chatId: number;
//   error?: string;
// }

// const MsgShow: React.FC<MsgShowProps> = ({ messages, chatId, error }) => {
//   const { profile, friends } = useContext(ContextGlobal);
//   const [username, setUsername] = useState<string>('');
//   const [friendId, setFriendId] = useState<number>(0);
//   const [status, setStatus] = useState<string>('');
//   const [isblock, setIsblock] = useState<boolean>(false);
//   const [chatRoomMembers, setChatRoomMembers] = useState<ChatRoomUsers[]>([]);
//   useEffect(() => {
//     if (chatId) {
//       getChatRoomMembers(chatId).then((res) => {
//         setChatRoomMembers(res.data);
//       }).catch((err) => {
//         console.log(err);
//       });
//     }
//   }, [chatId]);

//   useEffect(() => {
//     const targetMembers = chatRoomMembers.find((member) => member.user.id !== profile?.id);
//     if (targetMembers) {
//       setUsername(targetMembers.user.username);
//       setStatus(targetMembers.user.status);
//       setFriendId(targetMembers.user.id);
//       friends?.forEach((friend) => {
//         if (friend.receiver.id === targetMembers.user.id || friend.sender.id === targetMembers.user.id) {
//           setIsblock(friend.block);
//         }
//       });
//     }
//   }, [chatRoomMembers, profile, friends]);
//   return (
//     <>
//       <div className="bg-[#5D5959]/40 w-[66%] text-white h-[1030px] rounded-3xl p-4 hidden md:block">
//         {error === '' ? (
//           <>
//             <Chatheader username={username} status={status} userId={friendId} />
//             <div className='mt-6 h-[88%]'>
//               <Chat messages={messages} />
//             </div>
//             <Sendchatmsg chatRoomId={chatId} isblocked={isblock} friendId={friendId} />
//           </>
//         ) : (
//           <div className="flex justify-center items-center h-full text-2xl">
//             <p>
//               {error}
//             </p>
//           </div>
//         )}
//       </div>
//     </>
//   )
// };
// export default MsgShow;