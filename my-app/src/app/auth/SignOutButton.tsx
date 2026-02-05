"use client";
import { useRouter } from 'next/navigation'; // 2. Import useRouter
import { toast } from 'sonner';
import { logoutAction } from '../actions/Auth';

export function SignOutButton({ className }: { className: string }) {
    const router = useRouter(); // 3. Initialize router
    
    const HandleSignOut = async () => {
        try {
            await logoutAction();
            toast.success("Signed out successfully");
            router.refresh(); 
        }catch(err){
            toast.error((err as { message: string }).message)
        }
    }

    return (
        <button
            onClick={HandleSignOut}
            className={className}
        >
            Sign Out
        </button>
    )
}