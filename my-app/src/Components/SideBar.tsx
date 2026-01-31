"use client";
import { useUserInfos } from "@/context/UserInfos";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AiOutlineApartment } from "react-icons/ai";
import { FaArrowsAltH, FaUsers, FaUserTie } from "react-icons/fa";
import { FaFolderTree } from "react-icons/fa6";
import { FiSidebar } from "react-icons/fi"
import { GoHomeFill } from "react-icons/go";
import { RiInboxFill } from "react-icons/ri";


const SideBar__Navigations = [
    { name: "home", href:"", icon: GoHomeFill },
    { name: "my task", href:"tasks", icon: FaFolderTree },
    { name: "inbox", href: "inbox", icon: RiInboxFill },
    { name: "employees", href: "employees", icon: FaUsers },
    { name: "departments", href: "departments", icon: AiOutlineApartment },
    { name: "positions", href: "positions", icon: FaUserTie }
];
export function SideBar(){
    const [isOpen, setIsOpen] = useState(true);

    const pathname = usePathname();
    const isActive = (href: string) => {
        const fullPath = `/u/${User_Role}/${href}`;
        return pathname === fullPath || pathname.startsWith(`${fullPath}/`) || (href === "" && pathname === `/u/${User_Role}`);
    };
    const { userInfos, isLoadingUserInfos } = useUserInfos();
    const User_Role = userInfos?.role as "employee" | "admin";
    
    const SideBarNavigations = User_Role === "employee" ? 
        SideBar__Navigations.filter((item) => (item.name !== "dapartments" && item.name !== "employees"))
        :
        SideBar__Navigations;
    return (
        <div
            className={`group sticky top-0 w-full h-screen py-1.5 border-r
                ${isOpen ? "max-w-54 px-3 border-transparent hover:border-neutral-700/60" : "max-w-14 flex flex-col items-center border-neutral-700/60"} transition-width duration-300`}
        >
            <div
                className={`w-full flex items-center mt-3 px-3 ${isOpen ? "justify-between" : "justify-center"}`}
            >
                <span className="flex justify-center items-center">
                    {/* <Image
                        src="/STAFFY-LOGO.png"
                        quality={100}
                        priority
                        width={60}
                        height={60}
                        alt="STAFFY-LOGO.png"
                    /> */}
                    <h1
                        className={`font-bold uppercase text-blue-600
                            ${isOpen ? "text-xl" : "text-3xl group-hover:opacity-0 opacity-100"}`}
                    >
                        {isOpen ? "STAFFY" : "S"}
                    </h1>
                </span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`absolute right-0 w-full flex
                        ${isOpen ? "justify-end pr-4" : "justify-center group-hover:opacity-100 opacity-0"}`}
                >
                    {isOpen ?
                        <FiSidebar
                            size={34}
                            className="px-1.5 bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-transparent hover:border-neutral-700/60 cursor-pointer rounded-lg transition-colors duration-200"
                        /> 
                        : <FaArrowsAltH
                            size={36}
                            className="px-1.5 bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-transparent hover:border-neutral-700/60 cursor-pointer rounded-lg transition-colors duration-200"
                        />}
                </button>
            </div>
            <ul
                className={`flex flex-col px-1 my-3
                    ${isOpen ? "gap-0.5" : "gap-1.5 w-max"}`}
            >
                {isLoadingUserInfos ? 
                    Array(4).fill(0).map((_, idx) => {
                        return (
                            <span key={idx} className="mb-1.5 w-full h-6 rounded bg-neutral-300 animate-pulse" />
                        )
                    })
                :
                SideBarNavigations.map((nav, idx) => {
                    return (
                        <Link
                            key={idx}
                            href={`/u/${User_Role}/${nav.href}`}
                            className={`capitalize border
                                px-2 py-1.5 rounded-lg flex items-center gap-2
                                font-semibold text-sm
                                ${isActive(nav.href) ? "bg-neutral-800 text-neutral-200 border-neutral-700/60" : "border-transparent hover:bg-neutral-800 hover:text-neutral-200 text-neutral-500"}`}
                        >
                            <nav.icon size={isOpen ? 18 : 20}/> <span className={isOpen ? "block" : "hidden"}>{nav.name}</span>
                        </Link>
                    )
                })}
            </ul>
        </div>
    )
}