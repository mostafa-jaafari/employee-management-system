import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { mutate } from 'swr';

export function SignOutButton({ className }: { className: string }) {
    
    const HandleSignOut = async () => {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Error signing out: " + error.message);
            return;
        }
        mutate(() => true, undefined, { revalidate: false });
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
