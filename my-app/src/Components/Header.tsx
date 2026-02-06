import Link from 'next/link';
import { IoNotifications, IoSettingsSharp } from 'react-icons/io5';
import { RiMessage3Fill } from 'react-icons/ri';
import { DropDownHeaderProfile } from './DropDownHeaderProfile';
import { TokenUserInfosPayload } from '@/GlobalTypes';

const Header_Links = [
    { name: "Request Meeting Room", href: "/" },
    { name: "Timesheet", href: "/" },
    { name: "Career", href: "/" }
]

export async function Header({ User_Infos }: { User_Infos: TokenUserInfosPayload | undefined }) {

    return (
        <div
            className='flex items-center justify-between mb-3'
        >
            <ul
                className='text-neutral-500 text-sm flex items-center gap-6'
            >
                {Header_Links.map((nav, idx) => {
                    return (
                        <Link
                            key={idx}
                            href={nav.href}
                        >
                            {nav.name}
                        </Link>
                    )
                })}
            </ul>
            <div
                className='flex items-center gap-3'
            >
                {/* here was input search */}
                <span
                    className='flex items-center gap-3 text-neutral-600'
                >
                    <IoNotifications size={20}/>
                    <RiMessage3Fill size={20}/>
                    <IoSettingsSharp size={20}/>
                </span>
                {User_Infos !== null ? (
                    <DropDownHeaderProfile userInfos={User_Infos} />
                )
                :
                (
                    <Link
                        href="/auth/login"
                        className='bg-blue-600 hover:bg-blue-700 cursor-pointer w-max text-white font-semibold px-6 py-1.5 text-sm rounded-lg'
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    )
}
