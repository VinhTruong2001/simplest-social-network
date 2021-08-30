import Image from 'next/image';
import { useStateValue } from './common/StateProvider';
import { actionTypes } from './common/reducer';
import { auth } from '../firebase';

// Icons
import SearchIcon from '@material-ui/icons/Search';
import AppsIcon from '@material-ui/icons/Apps';
import ForumIcon from '@material-ui/icons/Forum';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Avatar } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import GroupIcon from '@material-ui/icons/Group';
import FlagIcon from '@material-ui/icons/Flag';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function Header() {
    const [{ sidebarStatus, user }, dispatch] = useStateValue();

    const signOut = () => {
        auth.signOut().then(() => {
            window.sessionStorage.clear();

            dispatch({
                type: actionTypes.SET_USER,
                user: null,
            })

        }).catch((error) => {
            console.log(error.message);
        });
    }

    const toggleSideBar = () => {
        dispatch({ 
            type: actionTypes.TOGGLE_SIDEBAR,
            sidebarStatus: !sidebarStatus 
        })
    }
    
    return (
        <div className="pt-3 pb-[6px] lg:pl-[180px] lg:pr-6 shadow-md sticky top-0 left-0 z-40 bg-gray-100 border-b border-gray-300 flex justify-between items-center">
            {/* Mobile header */}
            <div className="flex items-center space-x-2 lg:hidden pl-2">
                <div 
                    onClick={ toggleSideBar }
                    style={{ WebkitTapHighlightColor: "transparent" }}
                >
                    <MenuIcon fontSize="large" className="cursor-pointer text-gray-400"/>
                </div>
                <div>    
                    <Image
                        src="/images/logo.png"
                        width={130}
                        height={30}
                        objectFit="contain"
                    />
                </div>
            </div>

            {/* Search bar */}
            <div className="hidden lg:flex items-center md:w-[522px] rounded-full bg-gray-200 py-2 px-4">
                <SearchIcon className="mr-2"/>
                <input
                    className="w-full bg-transparent outline-none" 
                    type="text" 
                    name="searchBar"
                    placeholder="Tìm kiếm trên Simplest"
                />
            </div>

            {/* Notify */}
            <div className="flex items-center space-x-3">
                <div className="relative hidden lg:inline-block group">
                    <AppsIcon fontSize="large" className="icon-header text-[#6463ff]" />
                    <div className="absolute right-1 w-[272px] shadow-lg border border-gray-100 z-20 bg-white rounded-2xl origin-top-right transform scale-0 group-hover:scale-100 transition">
                        <ul className="grid grid-cols-2 px-[14px] py-2">
                            <li className="icon-header-app">
                                <EventIcon className="bg-gray-100 rounded-full p-2 box-content mb-1 text-red-400"/>
                                <p>Tạo Sự kiện</p>
                            </li>
                            <li className="icon-header-app">
                                <GroupIcon className="bg-gray-100 rounded-full p-2 box-content mb-1 text-blue-400"/>
                                <p>Tạo Nhóm</p>
                            </li>
                            <li className="icon-header-app">
                                <FlagIcon className="bg-gray-100 rounded-full p-2 box-content mb-1 text-[#f1a061]"/>
                                <p>Tạo Trang</p>
                            </li>
                            <li className="icon-header-app">
                                <PhotoLibraryIcon className="bg-gray-100 rounded-full p-2 box-content mb-1 text-green-400"/>
                                <p>Albums</p>
                            </li>
                        </ul>
                        <div className="w-full bg-gray-100 text-center text-gray-500 py-3 cursor-pointer">
                            Xem thêm
                        </div>
                    </div>  
                </div>
                <div>
                    <ForumIcon 
                        fontSize="large" 
                        className="icon-header text-[#6463ff]"
                        style={{ WebkitTapHighlightColor: "transparent" }}        
                    />
                </div> 
                <div>
                    <NotificationsIcon 
                        fontSize="large" 
                        className="icon-header text-[#6463ff]"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    />
                </div>
                <div className="hidden lg:inline-block relative group">
                    <div className="icon-header lg:flex items-center ">
                        <Avatar src={ user.photoURL || '' } />
                        <p className="font-semibold ml-2">{ user.displayName.split(' ').pop() }</p>
                    </div>
                    
                    <div className="absolute right-3 bg-white z-20 shadow-lg w-[300px] rounded-2xl origin-top-right transform scale-0 group-hover:scale-100 transition">
                        <div className="my-1 py-1 mx-5 border-b border-gray-300">
                            <div className="width-full py-2 px-3 flex items-center space-x-3 hover:bg-gray-200 cursor-pointer rounded-2xl">
                                <Avatar src={ user.photoURL || '' } />
                                <div>
                                    <h3 className="font-bold text-gray-600">{ user.displayName }</h3>
                                    <span className="text-gray-400 text-sm">Xem trang cá nhân của bạn</span>
                                </div>
                            </div>
                        </div>

                        <div className="my-1 py-1 mx-5">
                            <div className="width-full py-2 px-3 flex items-center space-x-3 hover:bg-gray-200 cursor-pointer rounded-2xl">
                                <div className="bg-gray-300 rounded-full p-2">
                                    <SettingsIcon />
                                </div>
                                <h3 className="font-bold text-gray-600">Cài đặt quyền riêng tư</h3>
                            </div>
                        </div>

                        <div className="my-1 py-1 mx-5">
                            <div className="width-full py-2 px-3 flex items-center space-x-3 hover:bg-gray-200 cursor-pointer rounded-2xl">
                                <div className="bg-gray-300 rounded-full p-2">
                                    <ContactSupportIcon />
                                </div>
                                <h3 className="font-bold text-gray-600">Trợ giúp & Hỗ trợ</h3>
                            </div>
                        </div>

                        <div onClick={ signOut } className="my-1 py-1 mx-5">
                            <div className="width-full py-2 px-3 flex items-center space-x-3 hover:bg-gray-200 cursor-pointer rounded-2xl">
                                <div className="bg-gray-300 rounded-full p-2">
                                    <ExitToAppIcon />
                                </div>
                                <h3 className="font-bold text-gray-600">Đăng xuất</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
