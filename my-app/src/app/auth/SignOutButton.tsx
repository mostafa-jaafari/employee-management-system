import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function SignOutButton({ className }: { className: string }) {
    
    const HandleSignOut = async () => {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Error signing out: " + error.message);
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
