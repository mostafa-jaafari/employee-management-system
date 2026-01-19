"use client";
import { SignOutButton } from '@/app/auth/SignOutButton';
import { useUserInfos } from '@/context/UserInfos';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react'
import { IoNotifications, IoSettingsSharp } from 'react-icons/io5';
import { RiMessage3Fill } from 'react-icons/ri';


const Header_Links = [
    { name: "Request Meeting Room", href: "/" },
    { name: "Timesheet", href: "/" },
    { name: "Career", href: "/" }
]
export function Header() {
    const [searchInput, setSearchInput] = useState("");
    const { userInfos } = useUserInfos();
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
                <input 
                    type="text"
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                    maxLength={50}
                    placeholder='Search here...'
                    className='text-sm min-w-[300px] bg-white p-1.5 rounded-lg outline-none border-b border-neutral-400 ring ring-neutral-300'
                />
                <span
                    className='flex items-center gap-3 text-neutral-600'
                >
                    <IoNotifications size={20}/>
                    <RiMessage3Fill size={20}/>
                    <IoSettingsSharp size={20}/>
                </span>
                {/* {JSON.stringify(userInfos)} */}
                {userInfos !== null ? (
                    <div
                        className='flex items-center gap-1.5'
                    >
                        <div
                            className='relative w-10 h-10 rounded-full overflow-hidden border-2 border-white'
                        >
                            <Image
                                src="/STAFFY-LOGO.png"
                                alt='User Profile'
                                fill
                                className='object-cover'
                                priority
                                quality={100}
                            />
                        </div>
                        <span
                            className="flex flex-col"
                        >
                            <h1 className='text-sm max-w-[120px] truncate text-neutral-600 font-semibold'>Mostafa Jaafari</h1>
                            <p className='text-xs max-w-[140px] truncate text-gray-400'>mostafajaafari@gmail.com</p>
                        </span>
                    </div>
                )
                :
                (
                    <SignOutButton className='bg-red-500 hover:bg-red-600 text-sm text-white px-6 py-1 rounded-lg cursor-pointer'/>
                )}
            </div>
        </div>
    )
}
