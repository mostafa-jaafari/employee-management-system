import React from 'react'
import { SetPasswordForm } from './SetPasswordForm'

export default function page() {
  return (
    <main
        className='w-full h-screen p-6 bg-white text-neutral-700 flex flex-col justify-center items-center'
    >
        <SetPasswordForm />
    </main>
  )
}
