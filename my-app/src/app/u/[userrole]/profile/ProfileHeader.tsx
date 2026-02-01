"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


const Navigation_Links = [
    {
        name: "Profile",
        href: "profile",
    },
    {
        name: "Account",
        href: "account",
    },
    {
        name: "Security",
        href: "security",
    },
];
export function HeaderProfile(){
    
    
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const currentTab = searchParams.get("tab") || "profile";
    
    const handleChangeTab = (tab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };
    return (
        <section
            className="w-full pt-3"
        >
            <span
                className="space-y-1"
            >
                <h1
                    className='text-xl md:text-2xl font-bold text-white'
                >
                    Settings
                </h1>
                <p
                    className="text-sm text-neutral-500"
                >
                    Manage your account settings and preferences.
                </p>
            </span>

            <ul
                className="w-full border-b border-neutral-700/60 flex items-center mt-6"
            >
                {Navigation_Links.map((link, index) => (
                    <button
                        key={index}
                        onClick={() => handleChangeTab(link.href)}
                        disabled={currentTab === link.href}
                        className={`block px-12 py-1.5 text-sm text-neutral-300 rounded-t-lg
                            ${currentTab === link.href ? 
                                "border-b-2 border-white text-white font-medium bg-white/5"
                                :
                                "hover:bg-neutral-800/50 cursor-pointer"
                            }`}
                    >
                        {link.name}
                    </button>
                ))}
            </ul>
        </section>
    )
}