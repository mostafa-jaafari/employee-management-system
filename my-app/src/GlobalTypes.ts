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

export type TaskType = {
    id: string;
    tasks: string[];
    assigned_to: string;
    due_date: string;
    due_time: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "in progress" | "completed";
    created_by: string;
    created_at: string;
}

export type TokenUserInfosPayload = {
    id: string;
    role: string;
    name: string;
    avatar_url: string;
    email: string;
}