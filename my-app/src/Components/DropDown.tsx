"use client";
import { useEffect, useRef, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa';
import { motion } from "framer-motion";


export function DropDown({ Label, Options, selectedLabel, HandleSelectOption, className, DefaultAllButton = true }: { Label: string; Options: string[]; selectedLabel: string; HandleSelectOption: (option: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; className: string; DefaultAllButton?: boolean; }) {
    const MenuRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

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
            className={`${className} ${isOpen ? "bg-neutral-800 border-neutral-600" : "border-neutral-700/60 bg-neutral-800/60"} border cursor-pointer relative flex items-center justify-between gap-3`}
        >
            <h2 className={`capitalize font-[500] ${isOpen ? "text-white" : "text-neutral-300"}`}>{selectedLabel !== "" ? selectedLabel : Label ? Label : "Label"}</h2> <FaChevronDown size={12} className={`${isOpen ? "rotate-180 text-white" : "text-neutral-300"} transition-transform duration-200`}/>
            {isOpen && (
                <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className='absolute left-0 top-full z-10 text-nowrap truncate
                        bg-neutral-800 border border-neutral-700/60
                        shadow-lg shadow-neutral-900 w-full max-h-50 overflow-y-auto mt-1 rounded-lg overflow-hidden p-1.5'
                >
                    <ul
                        className='flex flex-col'
                    >
                        {DefaultAllButton && (
                            <button
                                onClick={(e) => HandleSelectOption("all", e)}
                                className="px-1.5 py-1 text-neutral-400 hover:text-neutral-200 
                                    hover:bg-neutral-700/60 cursor-pointer 
                                    capitalize text-start border-b border-neutral-700/60"
                                >
                                All
                            </button>
                        )}
                        {Options.map((opt, idx) => {
                            return (
                                <button
                                    key={idx}
                                    onClick={(e) => HandleSelectOption(opt, e)}
                                    className={`px-1.5 py-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/60 cursor-pointer capitalize text-start
                                        ${idx !== Options.length - 1 && "border-b border-neutral-700/60"}`}
                                >
                                    {opt.toLowerCase()}
                                </button>
                            )
                        })}
                    </ul>
                </motion.div>
            )}
        </div>
    )
}
