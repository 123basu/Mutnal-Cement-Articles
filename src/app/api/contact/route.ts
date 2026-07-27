import { NextResponse } from "next/server";
import { appendContact } from "@/lib/github";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const message = (body.message || "").trim();

    const errors: string[] = [];
    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.push("Invalid email format");
    if (!phone) errors.push("Phone is required");
    if (!message) errors.push("Message is required");

    if (errors.length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    await appendContact({
      id: `c-${Date.now()}`,
      name,
      email,
      phone,
      message,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}
