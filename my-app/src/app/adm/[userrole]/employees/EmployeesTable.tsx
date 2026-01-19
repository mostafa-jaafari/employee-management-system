"use client";
import { DropDown } from '@/Components/DropDown';
import { EmployerType } from '@/types/Employer';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'
import { FaFilterCircleXmark } from 'react-icons/fa6';
import { HiOutlineDownload } from 'react-icons/hi';
import { IoSearch } from 'react-icons/io5';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { SlOptionsVertical } from 'react-icons/sl';


const LIMIT = 20;
export function EmployeesTable({ Employees_Data }: { Employees_Data: { TotalEmployees: number; data: EmployerType[]; Available_Status: string[]; } }) {
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
        router.push(`/adm/admin/employees?${searchParams.toString()}`);
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
    const Current_q_value = searchParams.get("q") || "";

    return (
        <div>
            {/* {JSON.stringify(searchParams.get("q"))} */}
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
                        className='flex items-center text-sm min-w-[300px] bg-white py-0.5 px-0.5 pl-3 rounded-lg border-b border-neutral-400 ring ring-neutral-300'
                    >
                        <input 
                            type="text"
                            onChange={(e) => setSearchTableInput(e.target.value)}
                            value={searchTableInput}
                            placeholder='Search employer here...'
                            maxLength={40}
                            className='w-full outline-none text-sm'
                        />
                        <button
                            onClick={HandleSearchTableInput}
                            disabled={searchTableInput.length === 0 && Current_q_value === ""}
                            className='text-neutral-600 hover:bg-neutral-200/30 
                                p-1.5 rounded-lg cursor-pointer border border-transparent 
                                hover:border-neutral-200 ml-1.5
                                disabled:cursor-not-allowed disabled:opacity-40'
                        >
                            {Current_q_value !== "" && searchTableInput.length === 0 ? <FaFilterCircleXmark title='clear search' className='text-red-600' size={20}/> : <IoSearch size={20}/>}
                        </button>
                    </div>

                    <div
                        className='flex items-center gap-3'
                    >
                        {/* DropDowns */}
                        <DropDown Options={Employees_Data?.Available_Status} Label="status" />
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
                    {Employees_Data.data.map((employer) => {
                        return (
                            <tr
                                key={employer.id}
                                className='border border-neutral-300 hover:bg-blue-50'
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
                                <td className='p-3 text-center text-xs'>
                                    <button
                                        className='cursor-pointer hover:bg-neutral-600/10 rounded-lg p-1'
                                    >
                                        <SlOptionsVertical size={14} className='text-neutral-500'/>
                                    </button>
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
                  disabled={currentPage === totalPages}
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