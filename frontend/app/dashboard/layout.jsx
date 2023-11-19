import Navbar from '../ui/dashboard/navbar/navbar'
import Sidebar from '../ui/dashboard/sidebar/sidebar'
import styles from "../ui/dashboard/dashboard.module.css"
import SideBarItem from '../ui/dashboard/SideBarItem/SidebarItem'
import {  BookUser,  Gamepad2, Home, LifeBuoy, MessageCircle, Settings, User } from 'lucide-react'
const Layout = ({children}) => {
    return (
      <div className={styles.container}>
        <div className={styles.menu}>
            <Sidebar>
              <SideBarItem icon={<Home size={20}/>} text="Home" alert number="2"/>
              <SideBarItem icon={<User size={20}/>} text="Profile" />
              <SideBarItem icon={<MessageCircle size={20}/>} text="Chat" active alert number="3"/>
              <SideBarItem icon={<BookUser size={20}/>} text="Friends" />
              <SideBarItem icon={<Gamepad2 size={20}/>} text="Game" />
              <hr className='my-3'/>
              <SideBarItem icon={<Settings size={20}/>} text="Settings" />
              <SideBarItem icon={<LifeBuoy size={20}/>} text="Help" alert number="10"/>

            </Sidebar>
        </div>
        <div className={styles.content}>
            {/* <Navbar /> */}
            {children}
        </div>
      </div>
    )
  }
  
  export default Layout
  