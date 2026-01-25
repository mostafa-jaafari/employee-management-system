import React from 'react'
import { IconType } from 'react-icons';


type StatCardProps = {
    Title: string;
    Value: number;
    Icon: IconType;
    BgColor: string;
    IconColor: string;
    BgIconColor: string;
    BorderColor: string;
}
export function StatCard({ Title, Value, Icon, BgColor, IconColor, BgIconColor, BorderColor }: StatCardProps) {
  return (
    <div
        className={`${BgColor} w-full min-h-20 flex gap-3 items-center 
            justify-start p-3 border ${BorderColor} rounded-lg`}
    >
        <span
            className={`flex w-max p-1.5 rounded-lg
                ${IconColor} ${BgIconColor}`}
        >
            <Icon size={24} />
        </span>

        <span
            className='-space-y-1'
        >
            <p className='capitalize text-neutral-500 text-sm'>{Title}</p>
            <h1 className='text-lg font-bold text-neutral-600'>{Value}</h1>
        </span>
    </div>
  )
}
