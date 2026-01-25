import React from 'react'
import { StatCard } from './StatCard'
import { FaUserPlus, FaUsers, FaUserTie } from 'react-icons/fa6';
import { GrUserFemale } from 'react-icons/gr';



const StatCards = [
    { title: "Total Employee", icon: FaUsers, value: 479, BorderColor: "border-gray-300/40", IconColor: "text-gray-600", BgIconColor: "bg-gray-200/60", BgColor: "bg-gray-200/20 hover:bg-gray-300/20" },
    { title: "New Employee", icon: FaUserPlus, value: 79, BorderColor: "border-green-300/40", IconColor: "text-green-600", BgIconColor: "bg-green-200/60", BgColor: "bg-green-200/20 hover:bg-green-300/20" },
    { title: "male", icon: FaUserTie, value: 301, BorderColor: "border-blue-300/40", IconColor: "text-blue-600", BgIconColor: "bg-blue-200/60", BgColor: "bg-blue-200/20 hover:bg-blue-300/20" },
    { title: "Female", icon: GrUserFemale, value: 99, BorderColor: "border-pink-300/40", IconColor: "text-pink-600", BgIconColor: "bg-pink-200/60", BgColor: "bg-pink-200/20 hover:bg-pink-300/20" }
];
export default function AdminPage() {
  return (
    <section
        className='w-full'
    >
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
                        BgColor={card.BgColor}
                        IconColor={card.IconColor}
                        BgIconColor={card.BgIconColor}
                        BorderColor={card.BorderColor}
                    />
                )
            })}
        </div>
    </section>
  )
}
