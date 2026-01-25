"use client";
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react'
import { FaGoogle, FaStarOfLife } from 'react-icons/fa';
import { toast } from 'sonner';

export function LoginForm() {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    })

    const HandleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,

            [name]: value,
        })
    }

    const router = useRouter();

    const HandleSubmitForm = async (e: FormEvent) => {
        e.preventDefault();

        if(inputs.email === "" || inputs.password === ""){
            toast.info("Please fill in all fields.");
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: inputs.email,
            password: inputs.password
        })
        if(error) {
            toast.error(error.message);
            return;
        }
        router.refresh();
        toast.success("welcome back!");
    }

    const supabase = createSupabaseBrowserClient();
    const signInWithProvider = async (provider: "google", e: MouseEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    // Point to the callback route, and pass the final destination as a query param
                    redirectTo: `${window.location.origin}/auth/callback?next=/adm/admin`, 
            },
        });

        if (error) throw error;

        // لا تحاول استخدام data.user هنا، سيتم redirect تلقائيًا
        toast.success("Redirecting to login provider…");
        router.refresh();
        } catch (err) {
        toast.error("Error signing in: " + (err as { message: string }).message);
        }
    };

    return (
        <form
            onSubmit={HandleSubmitForm}
            className='w-full h-full flex items-center justify-center'
        >
            <div
                className='w-full max-w-[450px] space-y-3'
            >
                {/* --- Title & Description --- */}
                <FaStarOfLife size={26} className='text-blue-600'/>
                <h1 className='text-3xl text-neutral-700 font-bold text-start'>Access your account</h1>
                <p
                    className='text-gray-500 text-sm mb-6'
                >
                    Welcome back! Enter your credentials to securely access your account and manage tasks efficiently.
                </p>

                {/* --- Email --- */}
                <div
                    className='flex flex-col'
                >
                    <label 
                        htmlFor="EmailInput" 
                        className='text-neutral-600 hover:text-neutral-700 cursor-pointer 
                            w-max mb-1'
                    >
                        Email
                    </label>
                    <input 
                        id='EmailInput'
                        type="email"
                        name='email'
                        onChange={HandleChangeInputs}
                        value={inputs.email}
                        placeholder='Enter your Email'
                        className='py-2 px-3 rounded-lg border-b border-neutral-400 ring 
                            ring-neutral-300 focus:ring-neutral-400 focus:border-transparent 
                            outline-none transition-border duration-200'
                    />
                </div>

                {/* --- Paswword --- */}
                <div
                    className='flex flex-col'
                >
                    <label 
                        htmlFor="PasswordInput" 
                        className='text-neutral-600 hover:text-neutral-700 cursor-pointer 
                            w-max mb-1'
                    >
                        Password
                    </label>
                    <input 
                        id='PasswordInput'
                        type="password"
                        name='password'
                        onChange={HandleChangeInputs}
                        value={inputs.password}
                        placeholder='Enter your Password'
                        className='py-2 px-3 rounded-lg border-b border-neutral-400 ring 
                            ring-neutral-300 focus:ring-neutral-400 focus:border-transparent 
                            outline-none transition-border duration-200'
                    />
                </div>

                {/* --- Submit Button --- */}
                <button
                    type='submit'
                    className='font-[550] text-white bg-gradient-to-t 
                        from-blue-700 to-blue-500 hover:to-blue-700 w-full 
                        px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200'
                >
                    Login
                </button>

                {/* --- Devider --- */}
                <div
                    className='flex items-center gap-1.5'
                >
                    <span className='flex w-full bg-gray-400/80 h-px'/>
                    <span className='text-gray-500 text-sm'>or</span>
                    <span className='flex w-full bg-gray-400/80 h-px'/>
                </div>

                {/* --- Providers --- */}
                <div
                    className='w-full flex items-center gap-1.5'
                >
                    <button
                        onClick={(e) => signInWithProvider("google", e)}
                        className='bg-gray-400/40 w-full py-2 flex gap-1.5 items-center text-sm justify-center rounded-lg border border-gray-400/10 hover:bg-gray-400/50 cursor-pointer'
                    ><FaGoogle size={20} /> Continue with Google</button>
                    {/* <button
                        className='bg-gray-400/40 w-full py-2 flex justify-center rounded-lg border border-gray-400/10 hover:bg-gray-400/50 cursor-pointer'
                    ><FaFacebookF size={20} /></button>
                    <button
                        className='bg-gray-400/40 w-full py-2 flex justify-center rounded-lg border border-gray-400/10 hover:bg-gray-400/50 cursor-pointer'
                    ><FaGithub size={20} /></button> */}
                </div>
            </div>
        </form>
    )
}
