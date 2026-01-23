import { EmployerType } from "@/types/Employer";
import { toast } from "sonner";


export function ConvertToCSV(EmployeesData: EmployerType[]){
    if(!EmployeesData) {
        toast.error("No data to export are available !")
        return "";
    }

    const headers = Object.keys(EmployeesData[0]).join(",");

    const rows = EmployeesData.map(row =>
        Object.values(row)
        .map(value => `"${value ?? ""}"`)
        .join(",")
    );

    return [headers, ...rows].join("/n");
}