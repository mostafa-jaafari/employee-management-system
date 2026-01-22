"use client";
import { useConfirmationModal } from '@/context/ConfirmationModal';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoIosWarning } from 'react-icons/io';


type ConfirmationModalTypes = { 
    Title: string; 
    ConfirmButtonLabel: string; 
    ButtonStylesColor?: string; 
    HandelConfirmModal: (IdToDelete?: string | undefined) => Promise<void>; 
    HandelCancelModal?: () => void; 
    ShowWarningMessage?: boolean; 
    WarningMessage?: string;
    isLoadingConfirmation: boolean;
}
export function ConfirmationModal({ Title, ConfirmButtonLabel, ButtonStylesColor, HandelConfirmModal, HandelCancelModal, ShowWarningMessage, WarningMessage, isLoadingConfirmation }: ConfirmationModalTypes) {
    const { isConfirmationModalOpen, setIsConfirmationModalOpen } = useConfirmationModal();

    if(!isConfirmationModalOpen) return null;
    return (
        <section
            className='absolute left-0 top-0 z-50 w-full h-screen backdrop-blur-[2px]
            overflow-hidden bg-black/20 flex justify-center items-center px-6'
        >
            <div
                className='w-full min-w-[300px] max-w-[500px] bg-white rounded-2xl'
            >
                <div
                    className='px-6 pt-6 pb-3'
                >
                    <h1
                        className='text-md font-semibold'
                    >
                        {Title}
                    </h1>

                </div>

                {ShowWarningMessage && (
                    <div
                        className='px-6 py-1.5'
                    >
                        <span
                            className='flex items-start md:items-center gap-1.5 text-yellow-800 bg-yellow-500/20 rounded-full text-xs px-3 py-1'
                        >
                            <IoIosWarning size={14} className='flex-shrink-0' /> {WarningMessage}
                        </span>
                    </div>
                )}
                <div
                    className='w-full border-t border-neutral-200 px-6 py-3 flex gap-1.5 justify-end items-center'
                >
                    <button
                        onClick={() => {
                            setIsConfirmationModalOpen(false)
                            HandelCancelModal?.();
                        }}
                        className='px-6 py-1.5 cursor-pointer rounded-full bg-transparent
                            hover:bg-neutral-100 text-neutral-600 font-semibold text-sm'
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isLoadingConfirmation}
                        onClick={() => HandelConfirmModal()}
                        className={`flex items-center gap-1.5 ${isLoadingConfirmation ? "px-3" : "px-6"} py-1.5 cursor-pointer rounded-full text-white 
                            font-semibold text-sm disabled:opacity-50 disabled:text-red-300 disabled:cursor-not-allowed
                            ${ConfirmButtonLabel.toLowerCase() === "delete" ?
                                "bg-red-600 hover:bg-red-700"
                                :
                                ButtonStylesColor ? 
                                ButtonStylesColor
                                : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {isLoadingConfirmation && (<AiOutlineLoading3Quarters size={14} className={isLoadingConfirmation ? "animate-spin" : ""}/>)} {ConfirmButtonLabel}
                    </button>
                </div>
            </div>
        </section>
    )
}
