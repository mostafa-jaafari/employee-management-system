"use client";
import Image from "next/image"
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaArrowsAltH, FaUsers } from "react-icons/fa";
import { FaFolderTree } from "react-icons/fa6";
import { FiSidebar } from "react-icons/fi"
import { GoHomeFill } from "react-icons/go";
import { RiInboxFill } from "react-icons/ri";



const SideBar__Navigations = [
    { name: "home", href:"", icon: GoHomeFill },
    { name: "my task", href:"task", icon: FaFolderTree },
    { name: "inbox", href: "inbox", icon: RiInboxFill },
    { name: "employees", href: "employees", icon: FaUsers },
];
export function SideBar(){
    const [isOpen, setIsOpen] = useState(true);
    const User_Role = useParams()?.userrole;
    
    return (
        <div
            className={`group sticky top-0 w-full h-screen py-1.5
                ${isOpen ? "max-w-54 px-3" : "max-w-14 flex flex-col items-center"} transition-width duration-300`}
        >
            <div
                className="w-full flex items-center justify-between"
            >
                <span className="w-max flex items-center">
                    <Image
                        src="/STAFFY-LOGO.png"
                        quality={100}
                        priority
                        width={60}
                        height={60}
                        alt="STAFFY-LOGO.png"
                    />
                    <h1
                        className={`font-bold text-xl uppercase text-blue-600
                            ${isOpen ? "block" : "hidden"}`}
                    >
                        STAFFY
                    </h1>
                </span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`absolute right-0 w-full flex
                        ${isOpen ? "flex justify-end pr-3" : "bg-gray-100 w-full h-12 items-center justify-center hidden group-hover:flex"}`}
                >
                    {isOpen ?
                        <FiSidebar
                            size={26}
                            className="text-neutral-500 cursor-pointer p-0.5 rounded hover:bg-neutral-700/10 transition-colors duration-200"
                        /> 
                        : <FaArrowsAltH
                            size={26}
                            className="text-neutral-500 cursor-pointer p-0.5 rounded hover:bg-neutral-700/10 transition-colors duration-200"
                        />}
                </button>
            </div>
            <ul
                className={`flex flex-col px-1.5 my-3
                    ${isOpen ? "" : "gap-1 w-max"}`}
            >
                {SideBar__Navigations.map((nav, idx) => {
                    return (
                        <Link
                            key={idx}
                            href={`/adm/${User_Role}/${nav.href}`}
                            className="capitalize hover:bg-neutral-400/20 hover:text-neutral-700 px-1.5 py-1 rounded text-neutral-600 flex items-center gap-1.5 font-semibold text-sm"
                        >
                            <nav.icon size={isOpen ? 16 : 20}/> <span className={isOpen ? "block" : "hidden"}>{nav.name}</span>
                        </Link>
                    )
                })}
            </ul>
        </div>
    )
}