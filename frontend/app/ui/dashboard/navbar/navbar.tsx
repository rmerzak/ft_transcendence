import { BellDot, MoreVertical } from "lucide-react"

const Navbar = () => {
    return (
      <div className=" flex justify-end px-4 pt-4">
         <div className='flex p-3 ps-6'>
            <div className={` flex justify-between items-center overflow-hidden transition-all`}>
              <MoreVertical color="#ffff" size={20}/>
              <BellDot color="#ffff" size={20}/>
            </div>
            <img src="/profile1.png" alt="foto" className="w-10 h-10 rounded-md"/>
          </div>
      </div>
    )
  }
  
  export default Navbar
  