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
            className='fixed left-0 top-0 z-50 w-full h-screen backdrop-blur-[1px]
            overflow-hidden bg-black/20 flex justify-center items-center px-6'
        >
            <div
                className='w-full min-w-[300px] max-w-[500px] bg-neutral-800 rounded-lg border border-neutral-700/60'
            >
                <div
                    className='px-6 pt-6 pb-3'
                >
                    <h1
                        className='text-md font-medium text-neutral-300'
                    >
                        {Title}
                    </h1>

                </div>

                {ShowWarningMessage && (
                    <div
                        className='px-6 py-1.5'
                    >
                        <span
                            className='flex items-start md:items-center gap-1.5 text-yellow-500 bg-yellow-500/20 rounded text-xs px-3 py-1.5'
                        >
                            <IoIosWarning size={14} className='flex-shrink-0' /> {WarningMessage}
                        </span>
                    </div>
                )}
                <div
                    className='w-full border-t border-neutral-700/60 px-6 py-3 flex gap-1.5 justify-end items-center'
                >
                    <button
                        onClick={() => {
                            setIsConfirmationModalOpen(false)
                            HandelCancelModal?.();
                        }}
                        className='px-6 py-2 cursor-pointer rounded-lg border border-neutral-700/60
                            bg-neutral-700/20 hover:bg-neutral-700/40 text-neutral-400 
                            hover:text-neutral-200 font-semibold text-sm'
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isLoadingConfirmation}
                        onClick={() => {
                            setIsConfirmationModalOpen(false);
                            HandelConfirmModal();
                        }}
                        className={`flex items-center gap-1.5 ${isLoadingConfirmation ? "px-3" : "px-6"} py-2 cursor-pointer rounded-lg text-neutral-200 hover:text-white border border-red-600/60 
                            font-semibold text-sm disabled:opacity-50 disabled:text-red-300 disabled:cursor-not-allowed
                            ${ConfirmButtonLabel.toLowerCase() === "delete" ?
                                "bg-red-700/80 hover:bg-red-700"
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
