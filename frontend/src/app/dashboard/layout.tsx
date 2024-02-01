"use client";

import { getFriendList } from '@/api/friendship/friendship.api';
import { getUnreadNotification } from '@/api/notifications/notifications.api';
import { getUserInfo } from '@/api/user/user';
import Navbar from '@/components/dashboard/navbar/navbar'
import Sidebar from '@/components/dashboard/sidebar/sidebar'
import { ContextGlobal, ContextProvider } from '@/context/contex';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import JotaiProvider from '@/app/dashboard/game/context/jotai';

import ChannelPopup from '@/components/chat/rooms/ChannelPopup';
import { ChatRoom } from '@/interfaces';

const Layout = ({children} : any) => {
  return (
      <div className="flex login-gradient">
        <ContextProvider>
          <JotaiProvider>
              {/* <div className="flex-1 bg-red-500"> */}
                  <Sidebar />
              {/* </div>  */}
              <div className="flex-[10] pb-28 ">
                  <Navbar />
                  {children}
              </div>
              <ToastContainer />
          </JotaiProvider>
        </ContextProvider>
      </div>
    )
  }
  
  export default Layout
  