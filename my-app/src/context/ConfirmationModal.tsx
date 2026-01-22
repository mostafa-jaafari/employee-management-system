"use client";

import { createContext, useContext, useState } from "react";

type ConfirmationModalTypes = {
    isConfirmationModalOpen: boolean;
    setIsConfirmationModalOpen: (isOpen: boolean) => void;
}
const ConfirmationModalContext = createContext<ConfirmationModalTypes | null>(null)

export function ConfirmationModalProvider({ children }: { children: React.ReactNode }){
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
    
    return (
        <ConfirmationModalContext.Provider value={{ isConfirmationModalOpen, setIsConfirmationModalOpen }}>
            {children}
        </ConfirmationModalContext.Provider>
    )
}


export function useConfirmationModal(){
    const context = useContext(ConfirmationModalContext);
    if(!context){
        throw new Error("useConfirmationModal must be used withing ConfirmationModalProvider")
    }
    return context;
}