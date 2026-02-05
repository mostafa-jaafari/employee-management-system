import { TokenUserInfosPayload } from "@/GlobalTypes";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(process.env.ROLE_SECRET_KEY);
export async function getUserInfos() {
  const token = (await cookies()).get("user-context")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as TokenUserInfosPayload | undefined;
  } catch {
    return null;
  }
}
