"use client"; // 1. Ensure this is a client component

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation'; // 2. Import useRouter
import { toast } from 'sonner';

export function SignOutButton({ className }: { className: string }) {
    const router = useRouter(); // 3. Initialize router
    
    const HandleSignOut = async () => {
        const supabase = createSupabaseBrowserClient();
        
        // 4. Perform the sign out
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            toast.error("Error signing out: " + error.message);
            return;
        }

        toast.success("Signed out successfully");

        // 5. CRITICAL STEPS:
        // 'refresh' clears the Next.js Router Cache (so server knows you are out)
        router.refresh(); 
        // 'replace' sends the user instantly to login, replacing the current history entry
        router.replace('/auth/login'); 
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