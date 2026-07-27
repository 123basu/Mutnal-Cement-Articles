import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { readProducts, writeProducts, deleteImage } from "@/lib/github";
import type { AdminProduct } from "@/lib/types";

async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await readProducts();
    return NextResponse.json({ ok: true, products: data.products });
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
    products?: AdminProduct[];
  };
  if (!Array.isArray(body.products)) {
    return NextResponse.json(
      { ok: false, error: "products[] is required" },
      { status: 400 }
    );
  }
  try {
    const old = await readProducts();
    const oldImages = new Set(old.products.map((p) => p.image).filter(Boolean));
    const newImages = new Set(body.products.map((p) => p.image).filter(Boolean));

    for (const img of oldImages) {
      if (!newImages.has(img)) {
        await deleteImage(img).catch(() => {});
      }
    }

    await writeProducts(body.products);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 502 }
    );
  }
}
