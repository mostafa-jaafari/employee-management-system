import React from 'react'
import { IconType } from 'react-icons';


type StatCardProps = {
    Title: string;
    Value: number;
    Icon: IconType;
}
export function StatCard({ Title, Value, Icon }: StatCardProps) {
  return (
    <div
        className="w-full min-h-20 flex gap-3 items-center 
            justify-start p-3 border rounded-lg bg-section-h
            border border-neutral-700/60"
    >
        <span
            className="flex w-max p-2 rounded-lg bg-neutral-800 border border-neutral-700/20"
        >
            <Icon size={24} />
        </span>

        <span>
            <p className='capitalize text-neutral-300 text-sm font-semibold'>{Title}</p>
            <h1 className='text-md font-semibold text-neutral-500'>{Value}</h1>
        </span>
    </div>
  )
}
