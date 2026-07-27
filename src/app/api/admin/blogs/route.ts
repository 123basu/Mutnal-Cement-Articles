import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { readBlogs, writeBlogs } from "@/lib/github";
import type { AdminBlog } from "@/lib/types";

const isDev = process.env.NODE_ENV === "development";

async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await readBlogs();
    return NextResponse.json({ ok: true, blogs: data.blogs });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 502 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as {
    blogs?: AdminBlog[];
  };
  if (!Array.isArray(body.blogs)) {
    return NextResponse.json(
      { ok: false, error: "blogs[] is required" },
      { status: 400 }
    );
  }
  try {
    await writeBlogs(body.blogs);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 502 }
    );
  }
}
