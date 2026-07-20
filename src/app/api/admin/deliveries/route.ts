import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { readDeliveries, writeDeliveries, type DeliveriesFile } from "@/lib/github";
import type { Delivery } from "@/lib/types";

async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await readDeliveries();
    return NextResponse.json({
      ok: true,
      deliveries: data.deliveries,
      sha: (data as DeliveriesFile & { sha: string }).sha,
    });
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
    deliveries?: Delivery[];
    sha?: string;
  };
  if (!Array.isArray(body.deliveries) || !body.sha) {
    return NextResponse.json(
      { ok: false, error: "deliveries[] and sha are required" },
      { status: 400 }
    );
  }
  try {
    await writeDeliveries(body.deliveries, body.sha);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 502 }
    );
  }
}
