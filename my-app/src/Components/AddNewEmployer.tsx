"use client";
import { useAddNewEmployer } from '@/context/AddNewEmployer';
import { FaXmark } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { DropDown } from './DropDown';
import { AddNewEmployerAction, UpdateEmployee } from '@/app/actions/AddNewEmployer';
import { toast } from 'sonner';
import { MdOutlineAddCircle } from 'react-icons/md';
import { AiOutlineApartment } from 'react-icons/ai';
import { AddNewDepartment } from '@/app/actions/Department';
import { useUserInfos } from '@/context/UserInfos';
import { useRouter } from 'next/navigation';
import { useDepartments } from '@/Hooks/useDepartments';


export function AddNewEmployer() {
    const { isOpenAddNewEmployer, setIsOpenAddNewEmployer, isOpenAddNewDepartment, setIsOpenAddNewDepartment, employeeDataToUpdate, setEmployeeDataToUpdate } = useAddNewEmployer();
    const { userInfos } = useUserInfos();

    const { mutateDepartments, departments: DepartmentsHook } = useDepartments(userInfos?.id);
    
    const today = new Date().toISOString().split("T")[0];
    const router = useRouter();
    const [inputs, setInputs] = useState({
        firstname: "",
        lastname: "",
        salary: 0,
        email: "",
        position: "",
        status: "" as "ACTIVE" | "INACTIVE" | "PROBATION",
        department: "",
        hired_at: today,
    })

    const derivedInputs = useMemo(() => {
        if (!employeeDataToUpdate) {
            return {
                firstname: "",
                lastname: "",
                salary: 0,
                email: "",
                position: "",
                status: "" as "ACTIVE" | "INACTIVE" | "PROBATION",
                department: "",
                hired_at: today,
            };
        }

        return {
            firstname: employeeDataToUpdate.first_name ?? "",
            lastname: employeeDataToUpdate.last_name ?? "",
            salary: employeeDataToUpdate.salary ?? 0,
            email: employeeDataToUpdate.email ?? "",
            position: employeeDataToUpdate.position ?? "",
            status: employeeDataToUpdate.status as "ACTIVE" | "INACTIVE" | "PROBATION",
            department: employeeDataToUpdate.department ?? "",
            hired_at: employeeDataToUpdate.hired_at ?? today,
        };
    }, [employeeDataToUpdate, today]);

    useEffect(() => {
        setInputs(derivedInputs);
    }, [derivedInputs]);

    const [newDepartment, setNewDepartment] = useState("");

    const [departments, setDepartments] = useState<string[]>([]);
    const fetchDepartments = () => {
        fetch("/api/departments")
        .then(res => res.json())
        .then(data => setDepartments(data));
    }
    useEffect(() => {
        fetchDepartments()
    },[DepartmentsHook])

    const HandleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value === 'salary' ? Number(value) : value,
        }))
    }

    const [isLoadingAddNewEmployer, setIsLoadingAddNewEmployer] = useState(false);
    const [isLoadingUpdateEmployer, setIsLoadingUpdateEmployer] = useState(false);
    const HandleAddNewEmployer = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // --- Check Validation Inputs ---
        if(!inputs.email || !inputs.firstname || !inputs.lastname || !inputs.salary || !inputs.department || !inputs.position || !!inputs.status && !inputs.hired_at){
            toast.info("Please fill all Inputs");
            return;
        }
        try{
            const formData = new FormData();
                formData.append('firstname', inputs.firstname || '');
                formData.append('lastname', inputs.lastname || '');
                formData.append('salary', (inputs.salary || 0).toString());
                formData.append('email', inputs.email || '');
                formData.append('position', inputs.position || '');
                formData.append('status', inputs.status.toUpperCase() || '');
                formData.append('department', inputs.department || '');
                formData.append('hired_at', inputs.hired_at || '');
                formData.append('chef_admin', userInfos?.id || '');
            
                if(!userInfos) {
                    toast.error("Please authenticated first !");
                    return;
                }
            if(employeeDataToUpdate === null){
                setIsLoadingAddNewEmployer(true);
                const Result = await AddNewEmployerAction(formData, userInfos?.role);
                if(!Result.success){
                    toast.error(Result.message)
                    setIsLoadingAddNewEmployer(false);
                    return;
                }
                setIsLoadingAddNewEmployer(false);
                toast.success("New Employer Added Successfully.");
            }else{
                if(!employeeDataToUpdate) return;
                setIsLoadingUpdateEmployer(true);
                const NewEmployeeUpdatedData = {
                    first_name: inputs.firstname,
                    last_name: inputs.lastname,
                    salary: Number(inputs.salary),
                    email: inputs.email,
                    position: inputs.position,
                    status: inputs.status.toUpperCase() as "ACTIVE" | "INACTIVE" | "PROBATION",
                    department: inputs.department,
                    hired_at: inputs.hired_at,
                };
                const Result = await UpdateEmployee(employeeDataToUpdate.id.toString(), NewEmployeeUpdatedData, userInfos.role);

                if(!Result.success){
                    toast.error(Result.message);
                    setIsLoadingUpdateEmployer(false);
                    return;
                }
                setIsLoadingUpdateEmployer(false);
                setEmployeeDataToUpdate(null);
                toast.success("Employee Updated Successfully.");
            }
            setIsOpenAddNewEmployer(false);
            setIsOpenAddNewDepartment(false);
        }catch(err){
            toast.error((err as { message: string }).message);
            setIsLoadingAddNewEmployer(false);
        }
    }
    
    const [isLoadingAddNewDepartment, setIsLoadingAddNewDepartment] = useState(false);
    const HandleAddNewDepartment = async () => {
        if(!userInfos || userInfos.role === "guest") return;

        if(newDepartment === ""){
            toast.info("Please type department first !");
            return;
        }
        setIsLoadingAddNewDepartment(true);
        try{
            const Result = await AddNewDepartment(userInfos?.id, newDepartment, userInfos?.role);
            if(!Result.success){
                toast.error(Result.message);
                setIsLoadingAddNewDepartment(false);
                return;
            }

            toast.success(newDepartment + ", " + "Added successfully.")
            mutateDepartments();
            setIsLoadingAddNewDepartment(false);
            setNewDepartment("");
            fetchDepartments();
        }catch (err){
            toast.error((err as { message: string }).message);
            setIsLoadingAddNewDepartment(false);
        }
    }

    if(!isOpenAddNewEmployer && !isOpenAddNewDepartment) return null;
    return (
        <section
            className='w-full h-screen overflow-hidden absolute z-50 left-0 top-0 text-neutral-700
                backdrop-blur-[2px] bg-black/20 flex justify-end items-end gap-1.5 p-6'
        >
            {isOpenAddNewDepartment && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className='relative w-full max-w-1/4 bg-neutral-800 rounded-lg border border-neutral-700/60 shadow-lg min-h-80'
                >
                    <header
                        className='w-full border-b border-neutral-700/60 flex items-center justify-between p-3'
                    >
                        <h1 className='text-sm text-neutral-300'>Add New Department</h1>
                        <button
                            onClick={() => setIsOpenAddNewDepartment(false)}
                            className='cursor-pointer text-neutral-500 hover:text-neutral-700'
                        >
                            <FaXmark size={16}/>
                        </button>
                    </header>
                    
                    {/* --- ADD New Department Body --- */}

                    {departments.length > 0 ? 
                        (
                            <ul
                                className='w-full p-3 grid grid-cols-3 gap-1.5'
                            >
                                {departments.slice(0, 9)
                                    .map((dep, idx) => {
                                        return (
                                            <div
                                                key={idx}
                                                className='flex justify-start items-center gap-1.5 
                                                    py-1 px-1.5 rounded border border-dashed 
                                                    border-neutral-600 text-neutral-300 w-full'
                                            >
                                                <AiOutlineApartment size={14} className='flex-shrink-0'/> 
                                                <span
                                                    className='max-w-24 truncate text-xs'
                                                >
                                                    {dep}
                                                </span>
                                            </div>
                                        )
                                    })}
                            </ul>
                        )
                    : (
                        <span
                            className='flex justify-center p-3 w-full text-gray-500 text-xs'
                        >
                            No Departments are available Now
                        </span>
                    )}

                    <div
                        className='w-full px-3 flex justify-center'
                    >
                        <button
                            onClick={() => {
                                setIsOpenAddNewDepartment(false);
                                setIsOpenAddNewEmployer(false);
                                router.push("/u/admin/departments")
                            }}
                            className='capitalize w-max flex justify-center items-center hover:underline text-blue-600 text-xs cursor-pointer'
                        >
                            view & manage All
                        </button>
                    </div>
                    {/* --- ADD New Employer Submit Button --- */}
                    <div
                        className='absolute left-0 bottom-0 w-full'
                    >
                        <div
                            className='w-full p-3'
                        >
                            <input 
                                type="text"
                                name='department'
                                onChange={(e) => setNewDepartment(e.target.value)}
                                value={newDepartment}
                                placeholder='Enter department...'
                                className='outline-none w-full py-3 text-sm px-3 rounded-lg placeholder:text-neutral-500 text-neutral-200 ring ring-neutral-700 focus:ring-blue-400 focus:border-blue-400'
                            />
                        </div>
                        <div
                            className='w-full p-3 border-t border-neutral-200'
                        >
                            <button
                                onClick={HandleAddNewDepartment}
                                disabled={newDepartment.trim() === "" || isLoadingAddNewDepartment}
                                className='bg-blue-600 hover:bg-blue-700 text-neutral-200 hover:bg-blue-700 
                                    py-3 px-6 text-sm w-full rounded-lg cursor-pointer
                                    disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-neutral-500'
                                >
                                    {isLoadingAddNewDepartment ? "Loading..." : "Add New Department"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
            {isOpenAddNewEmployer && (
                <motion.div
                    // ref={MenuRef}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className='relative w-full min-w-[200px] max-w-1/3 bg-neutral-800 
                        rounded-lg border border-neutral-700/60 shadow-lg min-h-120'
                >
                    {/* --- ADD New Employer Header --- */}
                    <header
                        className='w-full border-b border-neutral-700/60 flex items-center justify-between p-3'
                    >
                        <h1 className='text-neutral-300'>
                            Add New Employer
                        </h1>
                        <button
                            onClick={() => {
                                setEmployeeDataToUpdate(null);
                                setIsOpenAddNewEmployer(false);
                            }}
                            className='cursor-pointer text-neutral-600 hover:text-neutral-500'
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
                                className='w-full py-3 px-3 rounded-lg placeholder:text-neutral-500 text-neutral-200 focus:border-blue-400 ring ring-neutral-700 text-sm outline-none focus:ring-blue-400'
                                required
                            />
                            <input 
                                type="text"
                                name='lastname'
                                placeholder='Last Name'
                                onChange={HandleChangeInputs}
                                value={inputs.lastname}
                                className='w-full py-3 px-3 rounded-lg placeholder:text-neutral-500 text-neutral-200 focus:border-blue-400 ring ring-neutral-700 text-sm outline-none focus:ring-blue-400'
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
                                selectedLabel={inputs.position || ''}
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
                                className='w-full py-3 px-3 rounded-lg placeholder:text-neutral-500 text-neutral-200 focus:border-blue-400 ring ring-neutral-700 text-sm outline-none focus:ring-blue-400'
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
                                className='w-full py-3 px-3 rounded-lg placeholder:text-neutral-500 text-neutral-200 focus:border-blue-400 ring ring-neutral-700 text-sm outline-none focus:ring-blue-400'
                                required
                            />
                            <input
                                type="date"
                                id="HiredAtInput"
                                name="hired_at"
                                value={inputs.hired_at}
                                onChange={HandleChangeInputs}
                                className="w-max text-sm py-3 px-3 cursor-pointer outline-none rounded-lg placeholder:text-neutral-500 text-neutral-200 focus:border-blue-400 ring ring-neutral-700 focus:ring-blue-400 focus:text-blue-600"
                            />

                        </div>

                        <div
                            className='flex items-center gap-1.5'
                        >
                            <DropDown 
                                Label='Status'
                                HandleSelectOption={(option) => setInputs({...inputs, status: option as "ACTIVE" | "INACTIVE" | "PROBATION"})}
                                selectedLabel={inputs.status}
                                DefaultAllButton={false}
                                Options={["ACTIVE", "INACTIVE", "PROBATION"]}
                                className='w-full py-3 rounded-lg px-3 text-sm'
                            />
                            <DropDown 
                                Label='Department'
                                HandleSelectOption={(option) => setInputs({...inputs, department: option})}
                                selectedLabel={inputs.department || ''}
                                DefaultAllButton={false}
                                Options={departments}
                                className='w-full py-3 rounded-lg px-3 text-sm'
                            />
                        </div>
                    </div>

                    {/* --- Add New Departments --- */}
                    <div
                        className='absolute left-0 bottom-0 w-full'
                    >
                        <div
                            className='w-full flex gap-1.5 border-t border-neutral-700/60 py-1.5 px-3'
                        >
                            <button
                                onClick={() => setIsOpenAddNewDepartment(true)}
                                className='w-full flex items-center gap-1.5 justify-center
                                    py-2 hover:bg-neutral-700/20 bg-neutral-700/40 cursor-pointer 
                                    border border-neutral-700 text-sm rounded-lg
                                    text-neutral-300'
                            >
                                <MdOutlineAddCircle size={18} /> Add Department
                            </button>
                            <button
                                className='w-full flex items-center gap-1.5 justify-center
                                    py-2 hover:bg-neutral-700/20 bg-neutral-700/40 cursor-pointer 
                                    border border-neutral-700 text-sm rounded-lg
                                    text-neutral-300'
                            >
                                <MdOutlineAddCircle size={18} /> Add Position
                            </button>
                        </div>
                        {/* --- ADD New Employer Submit Button --- */}
                        <div
                            className='p-3 border-t border-neutral-700/60'
                        >
                            <button
                                disabled={isLoadingAddNewEmployer || isLoadingUpdateEmployer}
                                onClick={HandleAddNewEmployer}
                                className='bg-blue-600 hover:bg-blue-700 text-neutral-200 hover:bg-blue-700 
                                    py-3 px-6 text-sm w-full rounded-lg cursor-pointer
                                    disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-neutral-500'
                                >
                                    {(isLoadingAddNewEmployer || isLoadingUpdateEmployer) ? "Loading..." : employeeDataToUpdate === null ? "Add New Employer" : "Update Employer"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </section>
    )
}
