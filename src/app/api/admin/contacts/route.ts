import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { readContacts, writeContacts } from "@/lib/github";

async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const contacts = await readContacts();
    contacts.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
    return NextResponse.json({ ok: true, contacts });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 502 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
    }

    const contacts = await readContacts();
    const filtered = contacts.filter((c) => c.id !== id);
    if (filtered.length === contacts.length) {
      return NextResponse.json({ ok: false, error: "Contact not found" }, { status: 404 });
    }

    await writeContacts(filtered);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 502 }
    );
  }
}
