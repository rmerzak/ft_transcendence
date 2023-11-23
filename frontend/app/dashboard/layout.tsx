import Navbar from '../ui/dashboard/navbar/navbar'
import Sidebar, { SidebarItem } from '../ui/dashboard/sidebar/sidebar'
import {  BookUser,  Gamepad2, Home, LifeBuoy, MessageCircle, Settings, User } from 'lucide-react'
const Layout = ({children}) => {
    return (
      <div className="flex login-gradient">
        <div className="flex-1 ">
            <Sidebar>
              <SidebarItem icon={<Home color="#ffff" size={20}/>} to="/dashboard/home" text="Home"/>
              <SidebarItem icon={<User color="#ffff" size={20}/>} to="/dashboard/profile" text="Profile"  />
              <SidebarItem icon={<MessageCircle color="#ffff" size={20}/>} to="/dashboard/chat" text="Chat"/>
              <SidebarItem icon={<BookUser color="#ffff" size={20}/>} to="/dashboard/friends" text="Friends" />
              <SidebarItem icon={<Gamepad2 color="#ffff" size={20}/>} to="/dashboard/game" text="Game" />
              <hr className='my-3'/>
              <SidebarItem icon={<Settings color="#ffff" size={20}/>} to="/dashboard/profile" text="Settings" />
              <SidebarItem icon={<LifeBuoy color="#ffff" size={20}/>} to="/dashboard/profile" text="Help"/>

            </Sidebar>
        </div>
        <div className="flex-[10] ">
            <Navbar />
            {children}
        </div>
      </div>
    )
  }
  
  export default Layout
  