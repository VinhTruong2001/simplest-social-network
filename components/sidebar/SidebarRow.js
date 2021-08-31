import Link from 'next/link'
import { useStateValue } from '../common/StateProvider';
import { actionTypes } from '../common/reducer';

function SidebarRow({ link, Icon, title, active }) {
    const [{}, dispatch] = useStateValue();

    const closeSideBar = () => {
        if (window.innerWidth < 1280) {
            dispatch({
                type: actionTypes.TOGGLE_SIDEBAR,
                sidebarStatus: false
            })
        }
    }

    return (
        <div onClick={ closeSideBar } className={`relative hover:bg-[#5d77c2] rounded-l-full ${active && 'sidebarRowActive'} `}>
            <Link href={ link }>
                <a className="flex items-center py-3 pl-4 ">
                    <Icon className="text-white"/>
                    <p className="text-white text-[18px] ml-2">{ title }</p>
                </a>
            </Link>
        </div>
    )
}

export default SidebarRow
