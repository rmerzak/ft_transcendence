'use client'
import { getFriendList } from '@/api/friendship/friendship.api';
import { getUnreadNotification } from '@/api/notifications/notifications.api';
import { getUserInfo } from '@/api/user/user';
import Navbar from '@/components/dashboard/navbar/navbar'
import Sidebar from '@/components/dashboard/sidebar/sidebar'
import { ContextGlobal, ContextProvider } from '@/context/contex';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import JotaiProvider from '@/context/jotai';


const Layout = ({children} : any) => {
  const {  profile  ,setProfile, setFriends  } = useContext(ContextGlobal);
  useEffect(() => {
    //const user = axios.get(`http://localhost:3000/users/me`, {withCredentials:true}).then((res) => {setProfile(res.data);}).catch((err) => { console.log(err)});
    getUserInfo().then((res) => {
      if (res.data)
        setProfile(res.data);

    }).catch((err) => { console.log(err) });
  }, [profile]);

    return (
      <div className="flex login-gradient">
        <ContextProvider>
          <JotaiProvider>
            <div className="flex-1 ">
                <Sidebar />
            </div>
            <div className="flex-[10] ">
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
  