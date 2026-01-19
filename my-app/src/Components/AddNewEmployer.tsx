"use client";
import { useAddNewEmployer } from '@/context/AddNewEmployer';
import { FaXmark } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { DropDown } from './DropDown';


export function AddNewEmployer() {
    const { isOpenAddNewEmployer, setIsOpenAddNewEmployer } = useAddNewEmployer();
    // const MenuRef = useRef<HTMLDivElement | null>(null);
    
    // useEffect(() => {
    //     const hideMenu = (e: MouseEvent) => {
    //         if(MenuRef.current && !MenuRef.current.contains(e.target as Node)){
    //             setIsOpenAddNewEmployer(false);
    //         }
    //     }

    //     window.addEventListener("mousedown", hideMenu);
    //     return () => window.removeEventListener("mousedown", hideMenu);
    // },[])

    const [inputs, setInputs] = useState({
        firstname: "",
        lastname: "",
        salary: 0,
        email: "",
    })

    const HandleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        })
    }

    const [selectedOption, setSelectedOption] = useState("");
    const HandleSelectOption = (Label: string, option: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setSelectedOption(option);
    }

    if(!isOpenAddNewEmployer) return null;
    return (
    <section
        className='w-full h-screen overflow-hidden absolute z-50 left-0 top-0 text-neutral-700
            backdrop-blur-[2px] bg-black/20 flex justify-end items-end gap-1.5 p-6'
    >
        {/* <div
            className='w-full min-w-[200px] max-w-1/4 bg-white rounded-2xl border border-neutral-200 shadow-lg min-h-80'
        >hello world</div> */}
        <motion.div
            // ref={MenuRef}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className='relative w-full min-w-[200px] max-w-1/3 bg-white rounded-2xl border border-neutral-200 shadow-lg min-h-120'
        >
            {/* --- ADD New Employer Header --- */}
            <header
                className='w-full border-b border-neutral-200 flex items-center justify-between p-3'
            >
                <h1>
                    Staffy
                </h1>
                <button
                    onClick={() => setIsOpenAddNewEmployer(false)}
                    className='cursor-pointer text-neutral-500 hover:text-neutral-700'
                >
                    <FaXmark size={20}/>
                </button>

            </header>

            {/* --- Add New Employer Body Inputs --- */}

            {/* --- FirstName & LastName --- */}
            <div
                className='p-3 space-y-3'
            >
                <div
                    className='flex items-center gap-1.5'
                >
                    <input 
                        type="text"
                        name='firstname'
                        placeholder='First Name'
                        onChange={HandleChangeInputs}
                        value={inputs.firstname}
                        className='w-full py-3 px-3 rounded-lg border-b border-neutral-300 ring ring-neutral-200 text-sm outline-none focus:ring-blue-400'
                        required
                    />
                    <input 
                        type="text"
                        name='lastname'
                        placeholder='Last Name'
                        onChange={HandleChangeInputs}
                        value={inputs.lastname}
                        className='w-full py-3 px-3 rounded-lg border-b border-neutral-300 ring ring-neutral-200 text-sm outline-none focus:ring-blue-400'
                        required
                    />
                </div>

                {/* --- Position & Salary --- */}
                <div
                    className='flex items-center gap-1.5'
                >
                    <DropDown 
                        Label='Position'
                        HandleSelectOption={(option, e) => HandleSelectOption("position", option, e)}
                        selectedLabel={selectedOption}
                        DefaultAllButton={false}
                        Options={["test", "test test", "test test test"]}
                        className='w-full py-3 rounded-lg px-3 text-sm'
                    />
                    <input 
                        type="number"
                        name='salary'
                        placeholder='Salary'
                        onChange={HandleChangeInputs}
                        value={inputs.salary}
                        className='w-full py-3 px-3 rounded-lg border-b border-neutral-300 ring ring-neutral-200 text-sm outline-none focus:ring-blue-400'
                        required
                    />
                </div>
                {/* --- Email --- */}
                <input 
                    type="email"
                    name='email'
                    placeholder='Email'
                    onChange={HandleChangeInputs}
                    value={inputs.email}
                    className='w-full py-3 px-3 rounded-lg border-b border-neutral-300 ring ring-neutral-200 text-sm outline-none focus:ring-blue-400'
                    required
                />

                <div
                    className='flex items-center gap-1.5'
                >
                    <DropDown 
                        Label='Status'
                        HandleSelectOption={(option, e) => HandleSelectOption("Status", option, e)}
                        selectedLabel={selectedOption}
                        DefaultAllButton={false}
                        Options={["Active", "Inactive", "Probation"]}
                        className='w-full py-3 rounded-lg px-3 text-sm'
                    />
                    <DropDown 
                        Label='Department'
                        HandleSelectOption={(option, e) => HandleSelectOption("Department", option, e)}
                        selectedLabel={selectedOption}
                        DefaultAllButton={false}
                        Options={["test", "test test", "test test test"]}
                        className='w-full py-3 rounded-lg px-3 text-sm'
                    />
                </div>
            </div>

            {/* --- ADD New Employer Submit Button --- */}
            <div
                className='absolute left-0 bottom-0 w-full p-3 border-t border-neutral-200'
            >
                <button
                    className='text-white text-sm cursor-pointer bg-blue-600 rounded-lg w-full flex justify-center px-6 py-3'
                    >
                    Add New Employer
                </button>
            </div>
        </motion.div>
    </section>
  )
}
