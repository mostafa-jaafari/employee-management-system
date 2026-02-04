import { cookies } from "next/headers";

export async function getUserRole(){
    const cookieStore = await cookies();
    const userRole = cookieStore.get("user-role")?.value;

    if(!userRole){
        return { success: false, message: "Please login to get access!", UserRole: null }
    }
    return { success: true, message: "Get user role successfully.", UserRole: userRole }
}