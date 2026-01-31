"use client";
import { EmployerType } from "@/types/Employer";
import { createContext, useContext, useState } from "react";


type AddNewEntityTypes = {
    isOpenAddNewEmployer: boolean;
    setIsOpenAddNewEmployer: (isOpen: boolean) => void;
    isOpenAddNewDepartment: boolean;
    setIsOpenAddNewDepartment: (tab: boolean) => void;
    setIsOpenAddNewPosition: (tab: boolean) => void;
    isOpenAddNewPosition: boolean;
    employeeDataToUpdate: null | EmployerType;
    setEmployeeDataToUpdate: (data: null | EmployerType) => void;
}

const AddNewEntity_Context = createContext<AddNewEntityTypes | null>(null);

export function AddNewEntityProvider({ children }: { children: React.ReactNode }){
    
    const [isOpenAddNewEmployer, setIsOpenAddNewEmployer] = useState(false);
    const [isOpenAddNewDepartment, setIsOpenAddNewDepartment] = useState<boolean>(false);
    const [isOpenAddNewPosition, setIsOpenAddNewPosition] = useState<boolean>(false);
    const [employeeDataToUpdate, setEmployeeDataToUpdate] = useState<null | EmployerType>(null)
    return (
        <AddNewEntity_Context.Provider value={{ isOpenAddNewEmployer, setIsOpenAddNewEmployer, isOpenAddNewDepartment, setIsOpenAddNewDepartment, isOpenAddNewPosition, setIsOpenAddNewPosition, employeeDataToUpdate, setEmployeeDataToUpdate }}>
            {children}
        </AddNewEntity_Context.Provider>
    )
}

export const useAddNewEntity = () => {
  const context = useContext(AddNewEntity_Context);
  if (!context) {
    throw new Error("useAddNewEntity must be used within a AddNewEntityProvider");
  }
  return context;
};