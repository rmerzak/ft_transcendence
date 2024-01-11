import { getFriendList } from '@/api/friendship/friendship.api';
import { getUnreadNotification } from '@/api/notifications/notifications.api';
import { getUserInfo } from '@/api/user/user';
import Navbar from '@/components/dashboard/navbar/navbar'
import Sidebar from '@/components/dashboard/sidebar/sidebar'
import { ContextGlobal, ContextProvider } from '@/context/contex';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';


const Layout = ({children} : any) => {
    return (
      <div className="flex login-gradient">
        <ContextProvider>
        <div className="flex-1 ">
            <Sidebar />
        </div>
        <div className="flex-[10] ">
            <Navbar />
            {children}
        </div>
        <ToastContainer />
        </ContextProvider>
      </div>
    )
  }
  
  export default Layout
  