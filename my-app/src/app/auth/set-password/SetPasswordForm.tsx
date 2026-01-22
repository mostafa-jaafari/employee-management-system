"use client";
import { UpdateEmployee } from '@/app/actions/AddNewEmployer';
import React, { useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'sonner';

export function SetPasswordForm() {

    const [inputs, setInputs] = useState({
        newPassword: "",
        confirmPassword: "",
    })
    
    const HandleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        })
    }

    const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
    const HandleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(inputs.newPassword === "" || inputs.confirmPassword === ""){
            toast.error("Please fill all inputs first !");
            return;
        }

        setIsLoadingSubmit(true);

        try {
            const Result = await UpdateEmployee(inputs.newPassword);
            if(!Result.success){
                toast.error(Result.message);
                setIsLoadingSubmit(false);
                return;
            }

            toast.success(Result.message)
            setIsLoadingSubmit(false);
        }catch (err){
            toast.error((err as { message: string }).message)
            setIsLoadingSubmit(false);
        }
    }
  return (
    <form
        onSubmit={HandleSubmitForm}
        className='w-full py-12 flex flex-col justify-center items-center max-w-[500px]'
    >
        <h1 className="text-3xl font-bold text-neutral-800">Set Your Password</h1>
        <p
            className='text-gray-500 text-sm text-center mt-3 mb-6'
        >
            Enter your registration password to get login
        </p>

        <div
            className='w-full space-y-6 px-6 md:px-18'
        >
            <div
                className='w-full flex flex-col'
            >
                <label 
                    htmlFor="NewPassword" 
                    className='w-max cursor-pointer font-semibold 
                    text-sm mb-1 text-neutral-600 hover:text-neutral-700'>
                        New Password
                </label>
                <input 
                    id='NewPassword'
                    type="password" 
                    name='newPassword' 
                    onChange={HandleChangeInputs} 
                    value={inputs.newPassword} 
                    placeholder='Enter your new password'
                    className='w-full py-3 text-sm rounded-lg border-b ring ring-neutral-300 outline-none
                        border-neutral-400 px-3 focus:border-blue-400 focus:ring-blue-400'
                    required
                />
            </div>
            <div
                className='w-full flex flex-col'
            >
                <label 
                    htmlFor="ConfirmPassword" 
                    className='w-max cursor-pointer font-semibold text-sm 
                        mb-1 text-neutral-600 hover:text-neutral-700'>
                        Confirm Password
                </label>
                <input 
                    id='ConfirmPassword'
                    type="password" 
                    name='confirmPassword' 
                    onChange={HandleChangeInputs} 
                    value={inputs.confirmPassword} 
                    placeholder='Enter your confirm password'
                    className='w-full py-3 text-sm rounded-lg border-b ring ring-neutral-300 outline-none
                        border-neutral-400 px-3 focus:border-blue-400 focus:ring-blue-400'
                    required
                />
            </div>

            <button
                type='submit'
                disabled={inputs.newPassword === "" || inputs.confirmPassword === "" || isLoadingSubmit}
                className='flex items-center gap-1.5 justify-center w-full py-3 rounded-lg bg-blue-600 
                    hover:bg-blue-700 text-sm cursor-pointer text-white
                    disabled:opacity-50 disabled:text-neutral-300 disabled:cursor-not-allowed'
            >
                {isLoadingSubmit && <AiOutlineLoading3Quarters size={14} className={isLoadingSubmit ? "animate-spin" : ""}/>} Create Password
            </button>
        </div>
    </form>
  )
}
