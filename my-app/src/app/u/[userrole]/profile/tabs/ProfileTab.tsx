"use client";

import { useUserInfos } from "@/context/UserInfos";
import Image from "next/image";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";


export function ProfileTab(){

    const { userInfos } = useUserInfos();
    const [inputs, setInputs] = useState({
        fullname: userInfos?.name || "",
        emailaddress: userInfos?.email || "",
        avatar_url: userInfos?.avatar_url || "",
    })
    const HandleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    return (
        <section className="w-full">
            <div
                className="w-full grid md:grid-cols-3 grid-cols-1"
            >
                <div>
                    <span
                        className="space-y-1"
                    >
                        <h1 className="text-xl font-semibold text-white">Profile</h1>
                        <p className="text-neutral-500 text-sm">
                            Set your account details
                        </p>
                    </span>
                </div>

                <div
                    className="space-y-6"
                >
                    <div
                        className="flex flex-col"
                    >
                        <label 
                            htmlFor="FullName"
                            className="text-sm text-neutral-400 hover:text-neutral-200 cursor-pointer mb-0.5"
                        >
                                FullName
                        </label>
                        <input 
                            id="FullName" 
                            type="text"
                            name="fullname"
                            value={inputs.fullname}
                            onChange={HandleChangeInputs}
                            placeholder="FullName"
                            className="w-full px-3 py-2 text-sm outline-none rounded 
                                border border-neutral-700/60 focus:border-neutral-600 
                                focus:bg-neutral-700/10"
                        />
                    </div>

                    {/* --- Email --- */}
                    <div
                        className="flex flex-col"
                    >
                        <label 
                            htmlFor="EmailAddress"
                            className="text-sm text-neutral-400 hover:text-neutral-200 cursor-pointer mb-0.5"
                        >
                                Email Address
                        </label>
                        <input 
                            id="EmailAddress" 
                            type="email"
                            name="emailaddress"
                            value={inputs.emailaddress}
                            onChange={HandleChangeInputs}
                            placeholder="Email Address"
                            className="w-full px-3 py-2 text-sm outline-none rounded 
                                border border-neutral-700/60 focus:border-neutral-600 
                                focus:bg-neutral-700/10"
                        />
                    </div>
                </div>
                <div
                    className="w-full flex flex-col items-center"
                >
                    <div
                        className="relative w-[150px] h-[150px] rounded-full overflow-hidden border"
                    >
                        <Image
                            src={inputs.avatar_url}
                            alt={inputs.fullname}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div
                        className="flex items-center gap-1.5 mt-3"
                    >
                        <button
                            className="text-xs bg-neutral-800/60 hover:bg-neutral-800 cursor-pointer p-1.5 border border-neutral-700/60 rounded"
                        >
                            change photo
                        </button>
                        <button
                            className="p-1.5 cursor-pointer hover:bg-red-900/40 bg-red-900/20 border border-red-800/40 rounded text-red-700"
                        >
                            <FaTrash size={14} />
                        </button>
                    </div>
                </div>
            </div>
            <span className="my-3 flex h-px w-full bg-neutral-700/60"/>
        </section>
    )
}