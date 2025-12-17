import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";
import { UserService } from "@/services/user-service";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const userId = (form.get("userId") as string | null)?.trim();

    if (!file || !userId) {
      return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const blob = await put(`avatars/${userId}.${ext}`, file, { access: "public" });

    await UserService.update(userId, { avatar_url: blob.url });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Avatar upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const form = await request.formData();
    const userId = (form.get("userId") as string | null)?.trim();
    const avatarUrl = (form.get("avatarUrl") as string | null)?.trim();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (avatarUrl) {
      const url = new URL(avatarUrl);
      const pathname = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
      await del(pathname);
    }

    await UserService.update(userId, { avatar_url: null });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Avatar delete failed", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
