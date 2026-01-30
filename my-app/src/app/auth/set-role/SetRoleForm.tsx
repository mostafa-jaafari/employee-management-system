"use client";
import { SetRole } from "@/app/actions/SetRole";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaStarOfLife, FaUserTie } from "react-icons/fa6";
import { toast } from "sonner";


export function SetRoleForm() {
    const [selectedRole, setSelectedRole] = useState<"admin" | "employee" | null>(null);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    
    const router = useRouter();

    const HandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedRole) return;
        try{
            setIsLoadingSubmit(true);
            const res = await SetRole(selectedRole);
            const Role = res.role;
            if(res.success){
                toast.success("Role set successfully.");
                router.push(Role === "admin" ? "/u/admin" : "/u/employee");
            } else {
                toast.error(res.message);
            }
        }catch (err) {
            toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
        }finally{
            setIsLoadingSubmit(false);
        }
    }
    return (
        <form onSubmit={HandleSubmit} className="w-full flex flex-col max-w-2xl">
            <div
                className="w-full flex items-center justify-center py-12 md:gap-3 gap-1.5"
            >
                {/* --- Role: Admin --- */}
                {[{ icon: FaUserTie, label: "employee" }, { icon: FaStarOfLife, label: "admin" }].map((role, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => {
                            e.preventDefault();
                            setSelectedRole(role.label as "admin" | "employee");
                        }}
                        className={`relative w-full h-[200px]
                            flex flex-col justify-center items-center rounded-lg
                            cursor-pointer
                            ${selectedRole === role.label ? "ring-2 ring-blue-500 bg-blue-900/10" : "border bg-section-h border-neutral-700/60"}`}
                    >
                        {selectedRole === role.label && (
                            <span
                                className="absolute right-4 top-4"
                                >
                                <FaCheckCircle size={22} className="text-blue-600" />
                            </span>
                        )}
                        <role.icon size={48} className="text-neutral-300 mb-3"/>
                        <span
                            className="text-neutral-200 font-semibold text-lg capitalize"
                        >
                            Set as {role.label}
                        </span>
                    </button>
                ))}

            </div>
            <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-[500]
                    cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-600/50
                    hover:bg-blue-700 transition-colors duration-200"
                disabled={!selectedRole || isLoadingSubmit}
            >
                {isLoadingSubmit ? "Setting Role..." : "Set Role"}
            </button>
        </form>
    )
}