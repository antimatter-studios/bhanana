import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminJwt } from "@/lib/auth";
import { UserService } from "@/services/user-service";

export async function GET() {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyAdminJwt(token);
    const user = await UserService.getByUsername(payload.username);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({
      username: user.username,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
