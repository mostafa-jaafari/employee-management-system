"use client";
import { LoginAction } from '@/app/actions/LoginAction';
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

        const Res = await LoginAction(inputs.email, inputs.password);
        if(!Res?.success){
            toast.error(Res.ErrorMessage || "Login failed. Please try again.");
            return;
        }
        router.refresh();
        toast.success(Res.data?.user.email?.split('@')[0] + ", welcome back!");
    }

    const SingInWithProvider = async (provider: "google" | "facebook" | "github", e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if(provider === "facebook" || provider === "github"){
            toast.error("This provider is not available yet.");
            return;
        }

        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: window.location.origin + '/adm/admin',
            },
        });
        if(error){
            toast.error("Error signing in with " + provider + ": " + error.message);
            return;
        }
    }

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
                        onClick={(e) => SingInWithProvider("google", e)}
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
