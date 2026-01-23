"use client";
import { DeleteEmployee } from '@/app/actions/AddNewEmployer';
import { ConfirmationModal } from '@/Components/ConfirmationModal';
import { DropDown } from '@/Components/DropDown';
import { useAddNewEmployer } from '@/context/AddNewEmployer';
import { useConfirmationModal } from '@/context/ConfirmationModal';
import { EmployerType } from '@/types/Employer';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react'
import { FaTrash } from 'react-icons/fa6';
import { HiOutlineDownload } from 'react-icons/hi';
import { MdModeEdit, MdPersonAddAlt1 } from 'react-icons/md';
import { SlOptionsVertical } from 'react-icons/sl';
import { toast } from 'sonner';

const OptionsMenu = [
    { label: "Delete", icon: FaTrash },
    { label: "Edit", icon: MdModeEdit }
];
const OptionMenu = ({ EmployeesData, CurrentIndex, isOpenOptions, setIsOpenOptions }: { EmployeesData: EmployerType[]; CurrentIndex: number; isOpenOptions: boolean; setIsOpenOptions: (isOpen: null | number) => void; }) => {
    
    const { setIsConfirmationModalOpen } = useConfirmationModal();
    const { setIsOpenAddNewEmployer, setEmployeeDataToUpdate } = useAddNewEmployer();
    const OptionsMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const HideOptons = (e: MouseEvent) => {
            if(OptionsMenuRef.current && !OptionsMenuRef.current.contains(e.target as Node)){
                setIsOpenOptions(null);
            }
        }

        window.addEventListener("mousedown", HideOptons);
        return () => window.removeEventListener("mousedown", HideOptons);
    },[setIsOpenOptions])

    const [isLoadingDeleteEmployee, setIsLoadingDeleteEmployee] = useState(false);
    const HandleDeleteEmployee = async (EmployeeId: string) => {
        if(EmployeeId === ""){
            toast.error("Employee Id is Missing !")
            return;
        }

        setIsLoadingDeleteEmployee(true);
        try{
            const Result = await DeleteEmployee(EmployeeId);
            if(!Result.success){
                toast.error(Result.message);
                setIsLoadingDeleteEmployee(false);
                return;
            }

            toast.success(Result.message);
            setIsLoadingDeleteEmployee(false);
            setIsOpenOptions(null);
        }catch (err){
            toast.error((err as { message: string }).message)
            setIsLoadingDeleteEmployee(false);
        }
    }

    if(!isOpenOptions) return null;
    return (
        <div
            ref={OptionsMenuRef}
            className={`absolute z-40 right-0 w-full flex flex-col
                min-w-28 rounded-lg border border-neutral-300 shadow-lg bg-white py-1.5
                ${(CurrentIndex === EmployeesData.length - 1 || CurrentIndex === EmployeesData.length - 2 || CurrentIndex === EmployeesData.length - 3 ) ? 
                    "bottom-full"
                    :
                    "top-full" }`}
        >
            <ConfirmationModal
                ConfirmButtonLabel="Delete"
                Title={`Are you sure you want to delete "${EmployeesData[CurrentIndex].first_name} ${EmployeesData[CurrentIndex].last_name}" ?`}
                HandelConfirmModal={() => HandleDeleteEmployee(EmployeesData[CurrentIndex].id.toString())}
                HandelCancelModal={() => setIsOpenOptions(null)}
                ShowWarningMessage
                isLoadingConfirmation={isLoadingDeleteEmployee}
                WarningMessage="This department will be permanently deleted and cannot be recovered."
            />
            {OptionsMenu.map((item, idx) => {
                return (
                    <button
                        onClick={() => {
                            if(item.label.toLowerCase() === "delete"){
                                setIsConfirmationModalOpen(true);
                            }else if(item.label.toLowerCase() === "edit"){
                                setEmployeeDataToUpdate(EmployeesData[CurrentIndex])
                                setIsOpenAddNewEmployer(true);
                                // HandleUpdateEmployee(EmployeesData[CurrentIndex].id.toString(), EmployeesData[CurrentIndex]);
                            }
                        }}
                        key={idx}
                        className={`flex items-center gap-1.5 text-md py-1
                            cursor-pointer text-start px-3 font-semibold
                            ${OptionsMenu.length - 1 !== idx ? "border-b border-neutral-200" : ""}
                            ${item.label.toLowerCase() === "edit" ? 
                                "hover:bg-blue-100 text-neutral-600 hover:text-blue-600"
                                :
                                item.label.toLowerCase() === "delete" ?
                                "hover:bg-red-100 text-neutral-600 hover:text-red-600"
                                :
                                "hover:bg-neutral-100 text-neutral-600 hover:text-neutral-700"}`}
                    >
                        <item.icon size={12}/> {item.label}
                    </button>
                )
            })}
        </div>
    )
}
const LIMIT = 20;
export function EmployeesTable({ Employees_Data }: { Employees_Data: { TotalEmployees: number; data: EmployerType[]; Available_Status: string[]; } }) {
    const { setIsOpenAddNewEmployer } = useAddNewEmployer();
    
    const [isOpenOptions, setIsOpenOptions] = useState<null | number>(null);

    const [searchTableInput, setSearchTableInput] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get("page") || 1);
    const totalPages = Math.ceil(Employees_Data.TotalEmployees / LIMIT);

    const from = (currentPage - 1) * LIMIT + 1;
    const to = Math.min(
        currentPage * LIMIT,
        Employees_Data.TotalEmployees
    );

    const goToPage = (page: number) => {

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("page", page.toString());
        router.push(`/adm/admin/employees?${searchParams.toString()}`);
    };

    const HandleSearchTableInput = () => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchTableInput.length > 0) {
            searchParams.set("q", searchTableInput);
        } else {
            searchParams.delete("q");
        }
        router.push(`/adm/admin/employees?${searchParams.toString().trim()}`);
    }

    const pathname = usePathname();
    const [selectedLabel, setSelectedLabel] = useState("");
    const HandleSelectOption = (Label: string, option: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
        const handleKeyBoard = (e: KeyboardEvent) => {
            if(e.key === "Enter"){
                HandleSearchTableInput();
            }
        }
        window.addEventListener("keydown", handleKeyBoard);
        return () => window.removeEventListener("keydown", handleKeyBoard);
    })
    // const Current_q_value = searchParams.get("q") || "";

    return (
        <div>
            {/* --- Table Top Header --- */}
            <div
                className='space-y-1.5'
            >
                {/* --- Top Header --- */}
                <div
                    className='w-full flex items-center justify-between'
                >
                    <h1
                        className='font-semibold'
                    >
                        Employee Management
                    </h1>
                    <div
                        className='flex items-center gap-1.5'
                    >
                        <button
                            className='text-xs cursor-pointer hover:bg-gray-200/20 flex items-center gap-1.5 border border-neutral-300 rounded-lg px-3 py-1.5 text-neutral-600'
                        >
                            <HiOutlineDownload size={16}/> Export DataTable
                        </button>
                        <button
                            onClick={() => {
                                setIsOpenAddNewEmployer(true);
                            }}
                            className='text-xs cursor-pointer bg-blue-600 hover:bg-blue-600/90 flex items-center gap-1.5 border-b border-blue-800 rounded-lg px-3 py-1.5 text-white'
                        >
                            <MdPersonAddAlt1 size={14}/> Add Employer
                        </button>
                        <button
                            className='text-xs cursor-pointer hover:bg-gray-200/20 flex items-center gap-1.5 border border-neutral-300 rounded-lg px-2 py-1.5 text-neutral-600'
                        >
                            <SlOptionsVertical size={16}/>
                        </button>
                    </div>
                </div>
                {/* --- Botton Header --- */}
                <div
                    className='flex items-center justify-between'
                >
                    <div
                        className='flex items-center text-sm min-w-[300px] 
                            bg-white py-0.5 px-0.5 pl-3 rounded-lg border-b 
                            border-neutral-400 ring ring-neutral-300
                            focus-within:ring-blue-400 focus-within:border-blue-400'
                    >
                        <input 
                            type="text"
                            onChange={(e) => setSearchTableInput(e.target.value)}
                            value={searchTableInput}
                            placeholder='Search employer by FirstName'
                            maxLength={40}
                            className='w-full outline-none text-sm py-1.5'
                        />
                        {/* <button
                            onClick={HandleSearchTableInput}
                            disabled={searchTableInput.length === 0 && Current_q_value === ""}
                            className='text-neutral-600 hover:bg-neutral-200/30 
                                p-1.5 rounded-lg cursor-pointer border border-transparent 
                                hover:border-neutral-200 ml-1.5
                                disabled:cursor-not-allowed disabled:opacity-40'
                        >
                            {Current_q_value !== "" && searchTableInput.length === 0 ? <FaFilterCircleXmark title='clear search' className='text-red-600' size={20}/> : <IoSearch size={20}/>}
                        </button> */}
                    </div>

                    <div
                        className='flex items-center gap-3'
                    >
                        {/* DropDowns */}
                        <DropDown 
                            HandleSelectOption={(option, e) => HandleSelectOption("status", option, e)}
                            selectedLabel={selectedLabel}
                            Options={Employees_Data?.Available_Status} 
                            Label="status"
                            className='text-sm text-neutral-600 rounded-lg px-3 py-1.5 min-w-[150px] w-full max-w-[300px]'
                        />
                        {/* <DropDown /> */}
                    </div>
                </div>
            </div>
            <span className='flex bg-neutral-200 w-full h-px my-3'/>


            {/* --- Table Header --- */}
            <table
                className='relative w-full border-collapse'
            >
                <thead>
                    <tr
                        className='w-full border border-neutral-300'
                        >
                        {/* <th className='py-1.5 px-3 text-left text-sm capitalize font-semibold'><input type='checkbox'/> </th> */}
                        <th className='py-1.5 px-3 text-left text-sm capitalize font-semibold'>#</th>
                        <th className='py-1.5 px-3 text-left text-sm capitalize font-semibold'>Full Name</th>
                        <th className='py-1.5 px-3 text-left text-sm capitalize font-semibold'>Email</th>
                        <th className='py-1.5 px-3 text-left text-sm capitalize font-semibold'>Position</th>
                        <th className='py-1.5 px-3 text-left text-sm capitalize font-semibold'>Salary</th>
                        <th className='py-1.5 px-3 text-left text-sm capitalize font-semibold'>Status</th>
                        <th className='py-1.5 px-3 text-left text-sm capitalize font-semibold'>Departement</th>
                        <th className='py-1.5 px-3 text-left text-sm capitalize font-semibold'>Hired At</th>
                        <th className='py-1.5 px-3 text-left text-sm capitalize font-semibold'>Actions</th>
                    </tr>
                </thead>
                <tbody
                    className='overflow-y-auto'
                >
                    {Employees_Data.data.map((employer, idx) => {
                        return (
                            <tr
                                key={employer.id}
                                className={`border border-neutral-300
                                    ${isOpenOptions === idx ? "bg-neutral-200" : "hover:bg-blue-50"}`}
                            >
                                {/* <td className='p-3 text-left text-xs'>
                                    <input type='checkbox'/>
                                </td> */}
                                <td className='p-3 text-left text-xs'>
                                    {employer.id}
                                </td>
                                <td className='p-3 text-left text-xs'>
                                    {employer.first_name + ' ' + employer.last_name}
                                </td>
                                <td className='p-3 text-left text-xs'>
                                    {employer.email}
                                </td>
                                <td className='p-3 text-left text-xs'>
                                    {employer.position}
                                </td>
                                <td className='p-3 text-left text-xs'>
                                    {employer.salary} $
                                </td>
                                <td className={`p-3 text-left text-xs font-semibold
                                    ${employer.status.toLowerCase() === "active" ? "text-green-600" : employer.status.toLowerCase() === "inactive" ? "text-red-600" : "text-gray-500"}`}>
                                    {employer.status}
                                </td>
                                <td className='p-3 text-left text-xs'>
                                    {employer.department}
                                </td>
                                <td className='p-3 text-left text-xs'>
                                    {employer.hired_at}
                                </td>
                                <td className='relative p-3 text-center text-xs'>
                                    <button
                                        onClick={() => setIsOpenOptions(isOpenOptions === idx ? null : idx)}
                                        className='cursor-pointer hover:bg-neutral-600/10 rounded-lg p-1'
                                    >
                                        <SlOptionsVertical size={14} className='text-neutral-500'/>
                                    </button>
                                    {(
                                        <OptionMenu setIsOpenOptions={setIsOpenOptions} key={idx} isOpenOptions={isOpenOptions === idx} EmployeesData={Employees_Data.data} CurrentIndex={idx} />
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                    {/* Pagination */}
        <tr className="border border-neutral-300 bg-white">
          <td colSpan={9} className="p-3">
            <div className="flex items-center justify-between text-sm text-neutral-600">

              {/* Info */}
              <span>
                Showing <strong>{from}</strong> to <strong>{to}</strong> of{" "}
                <strong>{Employees_Data.TotalEmployees}</strong> results
              </span>

              {/* Controls */}
              <div className="flex items-center gap-1.5">

                {/* Prev */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 text-white cursor-pointer bg-blue-600 rounded-md text-xs
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:cursor-not-allowed"
                >
                  Prev
                </button>

                {/* Pages */}
                {Array.from({ length: totalPages })
                  .slice(0, currentPage + 1 > totalPages ? totalPages : currentPage + 1)
                  .map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-2.5 p-1.5 border border-blue-600 rounded-md text-xs
                          ${
                            page === currentPage
                              ? "bg-blue-600 text-white"
                              : "hover:bg-blue-100 cursor-pointer"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                {totalPages > 5 && <span className="px-2">...</span>}

                {/* Next */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || Employees_Data.TotalEmployees === 0}
                  className="px-2.5 py-1.5 text-white cursor-pointer bg-blue-600 rounded-md text-xs
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  );
}