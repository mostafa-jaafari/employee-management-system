"use client";
import { SignOutButton } from '@/app/auth/SignOutButton';
import { useUserInfos } from '@/context/UserInfos';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react'
import { FaUsers } from 'react-icons/fa';
import { FaFolderTree } from 'react-icons/fa6';
import { GoHomeFill } from 'react-icons/go';
import { IoNotifications, IoSettingsSharp } from 'react-icons/io5';
import { RiInboxFill, RiMessage3Fill } from 'react-icons/ri';
import { motion } from 'framer-motion';

const Header_Links = [
    { name: "Request Meeting Room", href: "/" },
    { name: "Timesheet", href: "/" },
    { name: "Career", href: "/" }
]

const Navigation_Menu_Links = [
    { name: "home", href:"", icon: GoHomeFill },
    { name: "my task", href:"task", icon: FaFolderTree },
    { name: "inbox", href: "inbox", icon: RiInboxFill },
    { name: "employees", href: "employees", icon: FaUsers },
];
export function Header() {
    const [searchInput, setSearchInput] = useState("");
    const { userInfos, isLoadingUserInfos } = useUserInfos();

    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const Open_Menu_Ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleHideMenu = (e: MouseEvent) => {
            if(Open_Menu_Ref.current && !Open_Menu_Ref.current.contains(e.target as Node)){
                setIsOpenMenu(false);
            }
        }

        window.addEventListener("mousedown", handleHideMenu);
        return () => window.removeEventListener("mousedown", handleHideMenu);
    },[])

    const NavigationMenuLinks = userInfos?.role === "employee" ?
        Navigation_Menu_Links.filter((nav) => nav.name !== "employees")
        :
        Navigation_Menu_Links;

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
                    className='text-sm min-w-[300px] bg-white px-3 py-2 rounded-lg 
                        outline-none border-b border-neutral-400 focus:border-blue-400 
                        ring ring-neutral-300 focus:ring-blue-400'
                />
                <span
                    className='flex items-center gap-3 text-neutral-600'
                >
                    <IoNotifications size={20}/>
                    <RiMessage3Fill size={20}/>
                    <IoSettingsSharp size={20}/>
                </span>
                {isLoadingUserInfos ? (
                    <div className='w-32 h-8 rounded-lg bg-neutral-300 animate-pulse'/>
                )
                :
                userInfos !== null ? (
                    <div
                        role='button'
                        ref={Open_Menu_Ref}
                        onClick={() => setIsOpenMenu(!isOpenMenu)}
                        className={`relative cursor-pointer hover:bg-neutral-200 
                            p-0.5 rounded-lg flex items-center gap-1.5 min-w-44
                            ${isOpenMenu ? "bg-neutral-200" : ""}`}
                    >
                        <div
                            className='relative w-10 h-10 flex justify-center items-center bg-gradient-to-r from-blue-300 to-blue-600 rounded-full overflow-hidden border-2 border-white'
                        >
                            {userInfos?.avatar_url ? (
                                <Image
                                    src={userInfos?.avatar_url}
                                    alt={userInfos?.name}
                                    fill
                                    className='object-cover'
                                    priority
                                    quality={100}
                                />
                            ) : (
                                <h1 className='text-white text-lg font-bold'>{userInfos.name.slice(0 ,1).toUpperCase()}</h1>
                            )}
                        </div>
                        <span
                            className="flex flex-col"
                        >
                            <h1 className='text-sm max-w-[120px] truncate text-neutral-600 font-semibold'>{userInfos.name || userInfos.email.split('@')[0]}</h1>
                            <p className='text-xs max-w-[140px] truncate text-gray-400'>{userInfos.email}</p>
                        </span>

                        {isOpenMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className='absolute z-50 left-0 top-full mt-1 bg-white w-full 
                                    space-y-0.5 text-sm rounded-lg shadow-lg p-1.5
                                    flex flex-col border border-neutral-200/80'
                            >
                                {NavigationMenuLinks.map((nav, idx) => {
                                    return (
                                        <Link
                                            href={`/u/${userInfos.role}/${nav.href}`}
                                            key={idx}
                                            className='capitalize flex items-center gap-1.5 
                                                hover:bg-neutral-100 cursor-pointer py-1 px-1.5 
                                                text-neutral-500 hover:text-neutral-700 rounded-lg'
                                        >
                                            <nav.icon size={16} /> {nav.name}
                                        </Link>
                                    )
                                })}
                                <SignOutButton className='bg-red-500 hover:bg-red-600 text-sm text-white px-6 py-1 rounded-lg cursor-pointer'/>
                            </motion.div>
                        )}
                    </div>
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
