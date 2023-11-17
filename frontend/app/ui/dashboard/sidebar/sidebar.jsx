import {MdDashboard} from 'react-icons/md';
const menuItems = [
  {
    title : "Pages",
    list : [
      {
        title: "home",
        path: "/dashboard/home",
        icon :<MdDashboard />,
      }
    ]
  }
]

const Sidebar = () => {
    return (
      <div>
        {/* {
          menuItems.map()
        } */}
      </div>
    )
  }
  
  export default Sidebar
  