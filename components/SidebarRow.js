import Link from 'next/link'

function SidebarRow({ link, Icon, title, active }) {
    return (
        <div className={`relative hover:bg-[#5d77c2] rounded-l-full ${active && 'sidebarRowActive'} `}>
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
