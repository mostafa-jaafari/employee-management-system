"use client";
import { useEffect, useRef, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa';
import { motion } from "framer-motion";
import { usePathname, useRouter } from 'next/navigation';


export function DropDown({ Label, Options }: { Label: string; Options: string[]; }) {
    const MenuRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("");
    
    const router = useRouter();
    const pathname = usePathname();

    const HandleSelectOption = (option: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setSelectedLabel(option);
        const searchParams = new URLSearchParams(window.location.search);
        if(option === "all") {
            searchParams.delete(Label.toLowerCase());
            router.push(`${pathname}?${searchParams.toString()}`);
            return;
        }
        searchParams.set(Label.toLowerCase(), option.toUpperCase());
        router.push(`${pathname}?${searchParams.toString()}`);
    }

    useEffect(() => {
        const HideMenu  = (e: MouseEvent) => {
            if(MenuRef.current && !MenuRef.current.contains(e.target as Node)){
                setIsOpen(false);
            }
        }
        window.addEventListener("mousedown", HideMenu);
        return () => window.removeEventListener("mousedown", HideMenu);
    },[])

    return (
        <div
            role='button'
            onClick={() => setIsOpen(!isOpen)}
            ref={MenuRef}
            className='relative flex items-center justify-between gap-3 hover:ring-neutral-300 hover:bg-neutral-100/50 cursor-pointer text-xs text-neutral-600 ring ring-neutral-200 border-b border-neutral-400/90 rounded-lg px-3 py-1.5 min-w-[150px] w-full max-w-[300px]'
        >
            <h2 className='capitalize'>{selectedLabel !== "" ? selectedLabel : Label ? Label : "Label"}</h2> <FaChevronDown size={12} className={`${isOpen ? "rotate-180" : ""} transition-transform duration-200`}/>
            {isOpen && (
                <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className='absolute left-0 top-full z-10 text-nowrap truncate bg-white border-b border-neutral-400/70 ring ring-neutral-200 shadow-lg w-full mt-1 rounded-lg overflow-hidden p-1.5'
                >
                    <ul
                        className='flex flex-col'
                    >
                        <button
                            onClick={(e) => HandleSelectOption("all", e)}
                            className="p-1.5 text-neutral-600 hover:bg-neutral-100 hover:rounded-lg cursor-pointer capitalize text-start
                                border-b border-neutral-200"
                        >
                            All
                        </button>
                        {Options.map((opt, idx) => {
                            return (
                                <button
                                    key={idx}
                                    onClick={(e) => HandleSelectOption(opt, e)}
                                    className={`p-1.5 text-neutral-600 hover:bg-neutral-100 hover:rounded-lg cursor-pointer capitalize text-start
                                        ${idx !== Options.length - 1 && "border-b border-neutral-200"}`}
                                >
                                    {opt}
                                </button>
                            )
                        })}
                    </ul>
                </motion.div>
            )}
        </div>
    )
}
