import { NextResponse } from "next/server";
import { verifyPassword, createSessionToken, SESSION_COOKIE } from "@/lib/session";

export async function POST(request: Request) {
  const { password } = (await request.json().catch(() => ({}))) as {
    password?: string;
  };

  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }

  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
