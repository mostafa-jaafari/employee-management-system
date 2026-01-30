import { SetRoleForm } from "./SetRoleForm";


export default function page() {
    return (
        <main
            className='w-full h-screen flex flex-col justify-start pt-24 px-6 md:px-12 text-center items-center'
        >
            <h1
                className="text-2xl font-bold text-white italic"
            >
                Please set your role to access the system.
            </h1>


            <SetRoleForm />
        </main>
    )
}