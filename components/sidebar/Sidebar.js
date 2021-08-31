import Image from 'next/image'
import Link from 'next/link'
import SidebarRow from './SidebarRow';
import { useStateValue } from '../common/StateProvider';
import { actionTypes } from '../common/reducer';

// Icons
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import HomeIcon from '@material-ui/icons/Home';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import EventIcon from '@material-ui/icons/Event';
import GamesIcon from '@material-ui/icons/Games';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import WorkIcon from '@material-ui/icons/Work';
import StoreIcon from '@material-ui/icons/Store';
import GroupIcon from '@material-ui/icons/Group';
import FlagIcon from '@material-ui/icons/Flag';

function Sidebar() {
    const [{ sidebarStatus }, dispatch] = useStateValue();

    const toggleSideBar = () => {
        dispatch({ 
            type: actionTypes.TOGGLE_SIDEBAR,
            sidebarStatus: false 
        })
    }

    return (
        <div className={`bg-[#1d3faa] flex flex-col absolute z-50 xl:sticky top-0 h-screen w-[236px] py-4 transform -translate-x-full ${sidebarStatus && 'translate-x-0'} transition xl:transform-none`}>
            {/* Logo */}
           <div className="border-b border-white flex items-center xl:block">
                <Link href="/">
                    <a className="block w-full h-full pt-6 pb-3 pl-4 pointer-events-none">    
                            <Image
                                src="/images/logo-light.png"
                                width={128}
                                height={32}
                                objectFit="contain"
                            />
                    </a>
                </Link>
                <div 
                    onClick={ toggleSideBar } 
                    className="xl:hidden cursor-pointer"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                >
                    <ArrowBackIosIcon className="text-gray-200"/>
                </div>
           </div>

            <div className="relative flex-1">
                {/* First part */}
                <div className="mt-3 pb-1 border-b border-gray-200">
                    <SidebarRow 
                        link="/"
                        Icon={ HomeIcon }
                        title="Trang chủ"
                        
                    />
                    <SidebarRow 
                        link="/gallery"
                        Icon={ PhotoLibraryIcon }
                        title="Thư viện ảnh"
                    />
                    <SidebarRow 
                        link="/events"
                        Icon={ EventIcon }
                        title="Sự kiện"
                    />
                    <SidebarRow 
                        link="/games"
                        Icon={ GamesIcon }
                        title="Trò chơi"
                    />
                    <SidebarRow 
                        link="/find-friends"
                        Icon={ PersonAddIcon }
                        title="Tìm kiếm bạn bè"
                    />
                    <SidebarRow 
                        link="/works"
                        Icon={ WorkIcon }
                        title="Việc làm"
                    />
                </div>

                {/* Second part */}
                <div className="mt-3 border-b border-gray-200 pb-2">
                    <h3 className="font-semibold text-xl pb-1 text-white">Khám phá</h3>
                    <SidebarRow 
                        link="/marketplaces"
                        Icon={ FlagIcon }
                        title="Trang"
                    />
                    <SidebarRow 
                        link="/marketplaces"
                        Icon={ GroupIcon }
                        title="Nhóm"
                    />
                    <SidebarRow 
                        link="/marketplaces"
                        Icon={ StoreIcon }
                        title="Marketplace"
                    />
                </div>

                {/* Footer */}
                <footer className="absolute bottom-0 text-gray-300">
                    <div className="space-x-3">
                        <Link href="#">
                            <a className="hover:underline">About us</a>
                        </Link>
                        <Link href="#">
                            <a className="hover:underline">Chính sách - Điều khoản</a>
                        </Link>
                        <Link href="#">
                            <a className="hover:underline">Cài đặt</a>
                        </Link>
                    </div>
                    <p>© 2020 Simplest. All Rights Reserved.</p>
                </footer>
            </div>
        </div>
    )
}

export default Sidebar
