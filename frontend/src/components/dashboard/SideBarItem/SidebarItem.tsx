'use client';
import "../../../components/globals.css"
const SideBarItem = ({ icon, text, active, alert, number }: { icon: JSX.Element, text: string, active: boolean, alert: boolean, number: number }) => {
    return (
        <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors
                ${active ? 'bg-gradient-to-tr from-indigo-100 to-indigo-200 text-indigo-800' : 'hover:bg-indigo-50 text-gray-600'}
                ${alert ? 'bg-gradient-to-tr from-red-100 to-red-200 text-red-800' : ''}}
                ${active && alert ? 'bg-gradient-to-tr from-indigo-100 to-indigo-200 text-indigo-800' : ''}
        `}>
            {icon}
            <span className="w-52 ml-3">{text}</span>
            {
                alert && <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 bg-red-500 rounded-full text-white text-xs">{number}</span>
            }
        </li>
    )
}
  
export default SideBarItem

