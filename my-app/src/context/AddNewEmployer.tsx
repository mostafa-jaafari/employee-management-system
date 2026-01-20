"use client";

import { createContext, useContext, useState } from "react";



type AddNewEmployerTypes = {
    isOpenAddNewEmployer: boolean;
    setIsOpenAddNewEmployer: (isOpen: boolean) => void;
    isOpenAddNewDepartment: boolean;
    setIsOpenAddNewDepartment: (tab: boolean) => void;
}

const AddNewEmployer_Context = createContext<AddNewEmployerTypes | null>(null);

export function AddNewEmployerProvider({ children }: { children: React.ReactNode }){
    
    const [isOpenAddNewEmployer, setIsOpenAddNewEmployer] = useState(false);
    const [isOpenAddNewDepartment, setIsOpenAddNewDepartment] = useState<boolean>(false);
    return (
        <AddNewEmployer_Context.Provider value={{ isOpenAddNewEmployer, setIsOpenAddNewEmployer, isOpenAddNewDepartment, setIsOpenAddNewDepartment }}>
            {children}
        </AddNewEmployer_Context.Provider>
    )
}

export const useAddNewEmployer = () => {
  const context = useContext(AddNewEmployer_Context);
  if (!context) {
    throw new Error("useAddNewEmployer must be used within a AddNewEmployerProvider");
  }
  return context;
};