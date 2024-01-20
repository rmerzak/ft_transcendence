// "use client"
// import { ContextGlobal } from '@/context/contex';
// import React, { use, useContext, useEffect } from 'react'
// import { ChatRoomMember, Messages } from '@/interfaces';
// import Image from 'next/image';

// interface ChatProps {
//   members?: ChatRoomMember[];
// }


// const Chat: React.FC<ChatProps> = ({ members }) => {
//   const { profile } = useContext(ContextGlobal);

//   return (
//     <div className='max-w-[80%] mx-auto overflow-y-auto md:max-h-[97%] p-2'>
//       {messages?.map((message, index) => {
//         const isOwnMessage = message.senderId === profile?.id;
//         const senderName = isOwnMessage ? "You" : message.sender?.username;

//         return (
//           <div key={index} className={`chat ${!isOwnMessage ? "chat-start" : "chat-end"}`}>
//             <div className="chat-image avatar">
//               <div className="w-10 rounded-full">
//                 <Image src={message.sender?.image ? message.sender?.image : "/images/blank.png"} alt="Tailwind CSS chat bubble component" width={40} height={40} />
//               </div>
//             </div>
//             <div className={`chat-header ${isOwnMessage ? "ml-2" : "mr-2"} flex gap-2 items-center mb-1`}>
//               {senderName}
//               <time className="text-xs opacity-50">{formatDate(message.createdAt ? message.createdAt : "")}</time>
//             </div>
//             <div className="chat-bubble bg-purplee text-white">{message.text}</div>
//           </div>
//         );
//     })}
//    </div>
//   );
// };

// export default Chat;

{/* <div className="chat-footer opacity-50">
  {isOwnMessage ? "Delivered" : `Seen at ${message.timestamp}`}
</div> */}