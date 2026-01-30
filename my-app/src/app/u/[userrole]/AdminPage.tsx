import React from 'react'
import { StatCard } from './StatCard'
import { FaUserPlus, FaUsers, FaUserTie } from 'react-icons/fa6';
import { GrUserFemale } from 'react-icons/gr';


const StatCards = [
    { title: "Total Employee", icon: FaUsers, value: 479 },
    { title: "New Employee", icon: FaUserPlus, value: 79 },
    { title: "male", icon: FaUserTie, value: 301 },
    { title: "Female", icon: GrUserFemale, value: 99 }
];
export default async function AdminPage() {
    return (
    <section
        className='w-full'
    >
        <div className='py-3'>
            <p className='text-xs text-neutral-200 font-semibold'>Statistics for all available employees</p>
        </div>
        <div
            className='w-full grid grid-cols-4 gap-1.5'
        >
            {StatCards.map((card, idx) => {
                return (
                    <StatCard
                        key={idx}
                        Title={card.title}
                        Value={card.value}
                        Icon={card.icon}
                    />
                )
            })}
        </div>
    </section>
  )
}
