"use client";
import { useAddNewEmployer } from '@/context/AddNewEmployer';
import { FaXmark } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { DropDown } from './DropDown';
import { AddNewEmployerAction } from '@/app/actions/AddNewEmployer';
import { toast } from 'sonner';


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

    const today = new Date().toISOString().split("T")[0];
    const [inputs, setInputs] = useState({
        firstname: "",
        lastname: "",
        salary: 0,
        email: "",
        position: "",
        status: "" as "active" | "inactive" | "probation",
        department: "",
        hired_at: today,
    })

    const HandleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        })
    }

    const [isLoadingAddNewEmployer, setIsLoadingAddNewEmployer] = useState(false);
    const HandleAddNewEmployer = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // --- Check Validation Inputs ---
        if(inputs.email === "" && inputs.firstname === "" && inputs.lastname === "" && inputs.salary === 0 && inputs.department === "" && inputs.position === "" && !inputs.status && inputs.hired_at === ""){
            toast.info("Please fill all Inputs");
            return;
        }
        setIsLoadingAddNewEmployer(true);
        try{
            const formData = new FormData();
                formData.append('firstname', inputs.firstname);
                formData.append('lastname', inputs.lastname);
                formData.append('salary', inputs.salary.toString());
                formData.append('email', inputs.email);
                formData.append('position', inputs.position);
                formData.append('status', inputs.status);
                formData.append('department', inputs.department);
                formData.append('hired_at', inputs.hired_at);
            
            const Result = await AddNewEmployerAction(formData);
            if(!Result.success){
                toast.error(Result.message)
                setIsLoadingAddNewEmployer(false);
                return;
            }
            setIsLoadingAddNewEmployer(false);
            setIsOpenAddNewEmployer(false);
            toast.success("New Employer Added Successfully: " + JSON.stringify(Result));
        }catch(err){
            toast.error((err as { message: string }).message);
            setIsLoadingAddNewEmployer(false);
        }
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
                        className='w-full py-3 px-3 rounded-lg border-b border-neutral-400 focus:border-blue-400 ring ring-neutral-300 text-sm outline-none focus:ring-blue-400'
                        required
                    />
                    <input 
                        type="text"
                        name='lastname'
                        placeholder='Last Name'
                        onChange={HandleChangeInputs}
                        value={inputs.lastname}
                        className='w-full py-3 px-3 rounded-lg border-b border-neutral-400 focus:border-blue-400 ring ring-neutral-300 text-sm outline-none focus:ring-blue-400'
                        required
                    />
                </div>

                {/* --- Position & Salary --- */}
                <div
                    className='flex items-center gap-1.5'
                >
                    <DropDown 
                        Label='Position'
                        HandleSelectOption={(option) => setInputs({...inputs, position: option})}
                        selectedLabel={inputs.position}
                        DefaultAllButton={false}
                        Options={["HR Manager", "test test", "test test test"]}
                        className='w-full py-3 rounded-lg px-3 text-sm'
                    />
                    <input 
                        type="number"
                        name='salary'
                        placeholder='Salary'
                        onChange={HandleChangeInputs}
                        value={inputs.salary}
                        className='w-full py-3 px-3 rounded-lg border-b border-neutral-400 focus:border-blue-400 ring ring-neutral-300 text-sm outline-none focus:ring-blue-400'
                        required
                    />
                </div>
                {/* --- Email --- */}
                <div
                    className='flex items-center gap-1.5'
                >
                    <input 
                        type="email"
                        name='email'
                        placeholder='Email'
                        onChange={HandleChangeInputs}
                        value={inputs.email}
                        className='w-full py-3 px-3 rounded-lg border-b border-neutral-400 focus:border-blue-400 ring ring-neutral-300 text-sm outline-none focus:ring-blue-400'
                        required
                    />
                    <input
                        type="date"
                        id="HiredAtInput"
                        name="hired_at"
                        value={inputs.hired_at}
                        onChange={HandleChangeInputs}
                        className="w-max text-sm py-3 px-3 cursor-pointer outline-none rounded-lg border-b border-neutral-400 focus:border-blue-400 ring ring-neutral-300 focus:ring-blue-400 focus:text-blue-600"
                    />

                </div>

                <div
                    className='flex items-center gap-1.5'
                >
                    <DropDown 
                        Label='Status'
                        HandleSelectOption={(option) => setInputs({...inputs, status: option as "active" | "inactive" | "probation"})}
                        selectedLabel={inputs.status}
                        DefaultAllButton={false}
                        Options={["active", "inactive", "probation"]}
                        className='w-full py-3 rounded-lg px-3 text-sm'
                    />
                    <DropDown 
                        Label='Department'
                        HandleSelectOption={(option) => setInputs({...inputs, department: option})}
                        selectedLabel={inputs.department}
                        DefaultAllButton={false}
                        Options={["HR", "test test", "test test test"]}
                        className='w-full py-3 rounded-lg px-3 text-sm'
                    />
                </div>
            </div>

            {/* --- ADD New Employer Submit Button --- */}
            <div
                className='absolute left-0 bottom-0 w-full p-3 border-t border-neutral-200'
            >
                <button
                    disabled={isLoadingAddNewEmployer}
                    onClick={HandleAddNewEmployer}
                    className='text-white text-sm cursor-pointer bg-gradient-to-t from-blue-600 to-blue-500
                        rounded-lg w-full flex justify-center px-6 py-3 hover:to-blue-600 border-b border-blue-800
                        disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-neutral-500'
                    >
                        {isLoadingAddNewEmployer ? "Loading..." : "Add New Employer"}
                </button>
            </div>
        </motion.div>
    </section>
  )
}
