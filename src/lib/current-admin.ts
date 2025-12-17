import { cookies } from "next/headers";
import { verifyAdminJwt } from "@/lib/auth";
import { UserService, type UserRow } from "@/services/user-service";

export async function getCurrentAdminUser(): Promise<UserRow | null> {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token) return null;
    const payload = await verifyAdminJwt(token);
    const user = await UserService.getByUsername(payload.username);
    return user;
  } catch {
    return null;
  }
}
