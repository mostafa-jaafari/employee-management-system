import { LoginForm } from './LoginForm'
import { FaStarOfLife } from 'react-icons/fa'

export default function page() {
    return (
    <main
        className='w-full h-screen p-6 flex items-start justify-between gap-6 overflow-auto text-neutral-200'
    >
        <div
            className="bg-gradient-to-tl from-blue-700 via-blue-600 to-blue-500 
                border border-blue-500 hidden md:flex flex-col justify-between 
                p-6 lg:p-12 rounded-2xl overflow-hidden shadow-lg 
                w-full max-w-3/7 min-w-[200px] h-full"
        >
            <FaStarOfLife size={50} className='text-blue-50'/>
            <span>
                <h1
                    className='text-white'
                >
                    Employee Management System
                </h1>
                <p
                    className='mt-3 text-2xl font-bold text-white'
                >
                    Manage employees, salaries, departments, and access from one secure platform.
                </p>
            </span>
        </div>
        <LoginForm />
    </main>
  )
}
