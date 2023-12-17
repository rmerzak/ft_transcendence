
import Navbar from '@/components/dashboard/navbar/navbar'
import Sidebar from '@/components/dashboard/sidebar/sidebar'


import {  BookUser,  Gamepad2, Home, Link, MessageCircle, User } from 'lucide-react'
const Layout = ({children} : any) => {
    return (
      <div className="flex login-gradient">
        <div className="flex-1 ">
            <Sidebar />
        </div>
        <div className="flex-[10] ">
            <Navbar />
            {children}
        </div>
      </div>
    )
  }
  
  export default Layout
  