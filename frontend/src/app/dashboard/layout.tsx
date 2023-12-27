'use client'
import { getUserInfo } from '@/api/user/user';
import Navbar from '@/components/dashboard/navbar/navbar'
import Sidebar from '@/components/dashboard/sidebar/sidebar'
import { ContextGlobal, ContextProvider } from '@/context/contex';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
const Layout = ({children} : any) => {
  const { profile, setProfile, notification } = useContext(ContextGlobal);
  useEffect(() => {
    const user = axios.get(`http://localhost:3000/users/me`, {withCredentials:true}).then((res) => {setProfile(res.data);}).catch((err) => { console.log(err)});
  }, []);
    return (
      <div className="flex login-gradient">
        {notification?.id}
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
  