'use client'
import { getUserInfo } from '@/api/user/user';
import Navbar from '@/components/dashboard/navbar/navbar'
import Sidebar from '@/components/dashboard/sidebar/sidebar'
import { ContextGlobal, ContextProvider } from '@/context/contex';
import { useContext, useEffect } from 'react';
const Layout = ({children} : any) => {
  // const { profile, setProfile } = useContext(ContextGlobal);
  // useEffect(() => {
  //   async function getUser() {
  //     try {
  //       const res = await getUserInfo();
  //       setProfile(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getUser();
  // }, []);
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
        </ContextProvider>
      </div>
    )
  }
  
  export default Layout
  