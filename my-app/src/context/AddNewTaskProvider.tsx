"use client";

import { createContext, useContext, useState } from "react";


type AddNewTaskTypes = {
    isOpenAddNewTask: boolean;
    setIsOpenAddNewTask: (isOpen: boolean) => void;
    employeesEmails: string[];
    setEmployeesEmails: (emails: string[]) => void;
}

const AddNewTaskContext = createContext<AddNewTaskTypes | null>(null);

export function AddNewTaskProvider({ children }: { children: React.ReactNode }){
    const [isOpenAddNewTask, setIsOpenAddNewTask] = useState(false);
    const [employeesEmails, setEmployeesEmails] = useState<string[]>([]);
    return (
        <AddNewTaskContext.Provider value={{ isOpenAddNewTask, setIsOpenAddNewTask, employeesEmails, setEmployeesEmails }}>
            {children}
        </AddNewTaskContext.Provider>
    )
}

export function useAddNewTask(){
    const Ctx = useContext(AddNewTaskContext);
    if(!Ctx){
        throw new Error("useAddNewTask must be used within a AddNewTaskProvider");
    }
    return Ctx;
}