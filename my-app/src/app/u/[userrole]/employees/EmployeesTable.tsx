"use client";
import { DeleteEmployeeAction } from '@/app/actions/Entity';
import { ConfirmationModal } from '@/Components/ConfirmationModal';
import { DropDown } from '@/Components/DropDown';
import { useAddNewEntity } from '@/context/AddNewEntityProvider';
import { useConfirmationModal } from '@/context/ConfirmationModal';
import { useUserInfos } from '@/context/UserInfos';
import { EmployerType } from '@/GlobalTypes';
import { ConvertToCSV } from '@/utils/ConvertToCSV';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa6';
import { HiOutlineDownload } from 'react-icons/hi';
import { MdFilterAltOff, MdModeEdit, MdPersonAddAlt1 } from 'react-icons/md';
import { SlOptionsVertical } from 'react-icons/sl';
import { toast } from 'sonner';

const OptionsMenu = [
    { label: "Delete", icon: FaTrash },
    { label: "Edit", icon: MdModeEdit }
];
const OptionMenu = ({ EmployeesData, CurrentIndex, isOpenOptions, setIsOpenOptions }: { EmployeesData: EmployerType[]; CurrentIndex: number; isOpenOptions: boolean; setIsOpenOptions: (isOpen: null | number) => void; }) => {
    const { userInfos } = useUserInfos();
    const { setIsConfirmationModalOpen } = useConfirmationModal();
    const { setIsOpenAddNewEmployer, setEmployeeDataToUpdate } = useAddNewEntity();
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

        if(!userInfos){
            toast.error("Please authenticate first !")
            return;
        }
        setIsLoadingDeleteEmployee(true);
        try{
            const Result = await DeleteEmployeeAction(EmployeeId, userInfos?.role);
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
            className={`absolute z-40 right-0 w-full flex flex-col overflow-hidden
                min-w-28 rounded-lg border border-neutral-700/60 shadow-lg bg-neutral-800
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
                        className={`flex items-center gap-1.5 text-md py-1.5
                            cursor-pointer text-start px-3 font-semibold
                            ${OptionsMenu.length - 1 !== idx ? "border-b border-neutral-700/60" : ""}
                            ${item.label.toLowerCase() === "edit" ? 
                                "hover:bg-blue-100 text-neutral-300 hover:text-blue-600"
                                :
                                item.label.toLowerCase() === "delete" ?
                                "hover:bg-red-100 text-neutral-300 hover:text-red-600"
                                :
                                "hover:bg-neutral-100 text-neutral-300 hover:text-neutral-700"}`}
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
    const { setIsOpenAddNewEmployer } = useAddNewEntity();
    
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
        router.push(`/u/admin/employees?${searchParams.toString()}`);
    };

    const HandleSearchTableInput = () => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchTableInput.length > 0) {
            searchParams.set("q", searchTableInput);
        } else {
            searchParams.delete("q");
        }
        router.push(`/u/admin/employees?${searchParams.toString().trim()}`);
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

    const [isLoadingDownload, setIsLoadingDownload] = useState(false);
    const HandleExportDataTable = () => {
        const Employees = Employees_Data.data;
        if(!Employees || Employees.length === 0){
            toast.error("No data is available right now to download it !")
            return;
        }

        setIsLoadingDownload(true);
        try{
            setTimeout(() => {
            const CSV_File = ConvertToCSV(Employees);
            const blob = new Blob([CSV_File], { type: "text/csv;charset=utf-8;" });
            const Url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = Url;
            link.setAttribute("download", "Employees.csv");
            // document.appendChild(link);
            link.click();
            // document.removeChild(link);
            URL.revokeObjectURL(Url);
            
            setIsLoadingDownload(false);
            toast.success("File donloaded successfully");
        }, 500);
        }catch (err){
            toast.error((err as { message: string }).message);
            setIsLoadingDownload(false);
        }
    }

    const HandleClearFilter = () => {
        setSelectedLabel("");
        setSearchTableInput("");
        router.push(`/u/admin/employees`);
    }

    return (
        <div>
            {/* --- Table Top Header --- */}
            <div
                className='space-y-3'
            >
                {/* --- Top Header --- */}
                <div
                    className='w-full flex items-center justify-between'
                >
                    <h1
                        className='text-xl md:text-2xl font-bold text-white'
                    >
                        Employee Management
                    </h1>
                    <div
                        className='flex items-center gap-1.5'
                    >
                        <button
                            disabled={isLoadingDownload}
                            onClick={HandleExportDataTable}
                            className='text-sm text-neutral-200 bg-neutral-800/60 hover:bg-neutral-800 cursor-pointer px-3 py-1.5 rounded-lg border border-neutral-700/60
                                disabled:opacity-70 disabled:cursor-not-allowed'
                        >
                            {isLoadingDownload ? (<span className='flex items-center gap-1.5'><AiOutlineLoading3Quarters size={12} className='animate-spin'/> Exporting DataTable...</span>) : (<span className='flex items-center gap-1.5'><HiOutlineDownload size={16}/> Export DataTable</span>)}
                        </button>
                        <button
                            onClick={() => {
                                setIsOpenAddNewEmployer(true);
                            }}
                            className='text-sm cursor-pointer bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 border-b border-blue-800 rounded-lg px-3 py-1.5 text-white'
                        >
                            <MdPersonAddAlt1 size={18}/> Add Employer
                        </button>
                        {/* <button
                            className='text-xs cursor-pointer hover:bg-gray-200/20 flex items-center gap-1.5 border border-neutral-300 rounded-lg px-2 py-1.5 text-neutral-600'
                        >
                            <SlOptionsVertical size={16}/>
                        </button> */}
                    </div>
                </div>
                {/* --- Botton Header --- */}
                <div
                    className='flex items-center justify-between'
                >
                    <div
                        className='text-sm min-w-[300px] bg-section-h px-3 rounded-lg 
                            ml-0.5 outline-none border-b border-neutral-600/60 focus-within:border-blue-400 
                            ring ring-neutral-700/60 focus-within:ring-blue-400'
                    >
                        <input 
                            type="text"
                            onChange={(e) => setSearchTableInput(e.target.value)}
                            value={searchTableInput}
                            placeholder='Search employer by FirstName'
                            maxLength={40}
                            className='w-full outline-none text-sm py-2'
                        />
                    </div>

                    <div
                        className='flex items-center gap-1.5'
                    >
                        {(searchParams.get("status") || searchParams.get("q")) &&
                        (
                            <button
                                onClick={HandleClearFilter}
                                className='flex items-center gap-1.5 bg-red-800/40 hover:bg-red-800/20 text-nowrap text-red-400 cursor-pointer text-sm px-3 py-1.5 border border-red-800 rounded-lg'
                            >
                                Clear Filters <MdFilterAltOff size={16}/>
                            </button>
                        )}
                        {/* DropDowns */}
                        <DropDown 
                            HandleSelectOption={(option, e) => HandleSelectOption("status", option, e)}
                            selectedLabel={selectedLabel}
                            Options={Employees_Data?.Available_Status} 
                            Label="status"
                            className='text-sm rounded-lg px-3 py-1.5 min-w-[150px] w-full max-w-[300px]'
                        />
                        {/* <DropDown /> */}
                    </div>
                </div>
            </div>
            <span className='flex bg-neutral-700/60 w-full h-px my-3'/>


            {/* --- Table Header --- */}
            <table
                className='relative w-full border-collapse'
            >
                <thead>
                    <tr
                        className='w-full border border-neutral-700/60 bg-neutral-800/60'
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
                                className={`border border-neutral-700/60
                                    ${isOpenOptions === idx ? "bg-neutral-700/60" : "hover:bg-neutral-800/60"}`}
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
                                        className='cursor-pointer hover:bg-neutral-700/60 rounded-lg p-1'
                                    >
                                        <SlOptionsVertical size={14} className='text-neutral-300'/>
                                    </button>
                                    {(
                                        <OptionMenu setIsOpenOptions={setIsOpenOptions} key={idx} isOpenOptions={isOpenOptions === idx} EmployeesData={Employees_Data.data} CurrentIndex={idx} />
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                    {/* Pagination */}
        <tr className="border border-neutral-700/60 bg-neutral-800/60">
          <td colSpan={9} className="p-3">
            <div className="flex items-center justify-between text-sm text-neutral-400">

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
                  className="px-2.5 py-1.5 font-semibold text-neutral-700 cursor-pointer bg-white rounded-md text-xs
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
                        className={`px-2.5 p-1.5 border border-neutral-700/60 rounded-md text-xs
                          ${
                            page === currentPage
                              ? "bg-neutral-800/60 text-white"
                              : "hover:bg-neutral-700/60 cursor-pointer"
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
                  className="px-2.5 py-1.5 text-neutral-700 cursor-pointer bg-white font-semibold rounded-md text-xs
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