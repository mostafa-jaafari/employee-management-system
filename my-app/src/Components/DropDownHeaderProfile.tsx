"use client";
import { TokenUserInfosPayload } from "@/GlobalTypes";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SignOutButton } from "@/app/auth/SignOutButton";
import { FaUsers } from 'react-icons/fa';
import { FaFolderTree } from 'react-icons/fa6';
import { GoHomeFill } from 'react-icons/go';
import { RiInboxFill } from 'react-icons/ri';


const Navigation_Menu_Links = [
    { name: "home", href:"", icon: GoHomeFill },
    { name: "tasks", href:"tasks", icon: FaFolderTree },
    { name: "inbox", href: "inbox", icon: RiInboxFill },
    { name: "employees", href: "employees", icon: FaUsers },
];
export const DropDownHeaderProfile = ({ userInfos }: { userInfos: TokenUserInfosPayload | undefined; }) => {
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
            role='button'
            ref={Open_Menu_Ref}
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            className={`relative cursor-pointer hover:bg-neutral-800 
                px-1 py-0.5 rounded-lg flex items-center gap-1.5 min-w-44
                border hover:border-neutral-700/60
                ${isOpenMenu ? "bg-neutral-800 border-neutral-700/60" : "border-transparent"}`}
        >
            <div
                className='relative w-9 h-9 flex justify-center items-center bg-gradient-to-r from-blue-300 to-blue-600 rounded-full overflow-hidden border-2 border-white'
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
                    <h1 className='text-white text-lg font-bold'>{userInfos?.name.slice(0 ,1).toUpperCase()}</h1>
                )}
            </div>
            <span
                className="flex flex-col"
            >
                <h1 className='text-sm max-w-[120px] truncate text-neutral-100 font-semibold'>{userInfos?.name || userInfos?.email.split('@')[0]}</h1>
                <p className='text-xs max-w-[140px] truncate text-gray-400'>{userInfos?.email}</p>
            </span>

            {isOpenMenu && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className='absolute z-50 left-0 top-full mt-1 bg-neutral-800 w-full 
                        space-y-0.5 text-sm rounded-lg shadow-lg p-1.5
                        flex flex-col border border-neutral-700/60'
                >
                    {NavigationMenuLinks.map((nav, idx) => {
                        return (
                            <Link
                                href={`/u/${userInfos?.role}/${nav.href}`}
                                key={idx}
                            >
                                <div
                                    className="capitalize flex items-center gap-2
                                        hover:bg-neutral-700/60 cursor-pointer py-1.5 px-2 
                                        text-neutral-400 hover:text-neutral-100"
                                        >
                                    <nav.icon size={16} /> {nav.name}
                                </div>
                                {idx !== NavigationMenuLinks.length -1 && <span className="border-b border-neutral-700/60 w-full block" />}
                            </Link>
                        )
                    })}
                    <SignOutButton className='bg-red-800 border border-red-600 hover:bg-red-800/80 text-sm text-white px-6 py-1 rounded cursor-pointer'/>
                </motion.div>
            )}
        </div>
    )
}