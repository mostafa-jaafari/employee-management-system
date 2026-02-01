"use client";

import { createContext, useContext, useState } from "react";


type AddNewTaskTypes = {
    isOpenAddNewTask: boolean;
    setIsOpenAddNewTask: (isOpen: boolean) => void;
}

const AddNewTaskContext = createContext<AddNewTaskTypes | null>(null);

export function AddNewTaskProvider({ children }: { children: React.ReactNode }){
    const [isOpenAddNewTask, setIsOpenAddNewTask] = useState(false);
    return (
        <AddNewTaskContext.Provider value={{ isOpenAddNewTask, setIsOpenAddNewTask }}>
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