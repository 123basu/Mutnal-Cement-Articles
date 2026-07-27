import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import fs from "node:fs";
import path from "node:path";
import type { AdminProduct } from "@/lib/types";

function getProducts(): AdminProduct[] {
  const filePath = path.join(process.cwd(), "src/data/products.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as { products: AdminProduct[] };
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Products");
  const products = getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold text-stone-900">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-600">{t("intro")}</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
          >
            <div className="h-40 w-full overflow-hidden bg-stone-100">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-stone-400 text-sm">
                  No image
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-stone-900">
                {p.name}
              </h2>
              <p className="mt-2 text-sm text-stone-600">{p.description}</p>
              {p.specs.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                    {t("specsLabel")}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {p.specs.map((s) => (
                      <li
                        key={s}
                        className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
