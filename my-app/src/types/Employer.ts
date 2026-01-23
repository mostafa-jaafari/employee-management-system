export type EmployerType = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    position: string;
    salary: number;
    status: "ACTIVE" | "INACTIVE" | "PROBATION";
    department: string;
    hired_at: string;
}