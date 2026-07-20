import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

const PRODUCTS = [
  {
    slug: "solid-1",
    titleKey: "solidSize1Title",
    textKey: "solidSize1Text",
    image: "/block_size_1.webp",
    accent: "bg-brick-500",
    specs: ["9x4x3 in", "Load bearing", "IS 1077"],
  },
  {
    slug: "solid-2",
    titleKey: "solidSize2Title",
    textKey: "solidSize2Text",
    image: "/block_size_2.webp",
    accent: "bg-brick-600",
    specs: ["8x4x3 in", "Load bearing", "IS 1077"],
  },
] as const;

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Products");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold text-stone-900">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-600">{t("intro")}</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p) => (
          <div
            key={p.slug}
            className="overflow-hidden rounded-2xl border border border-stone-200 bg-white shadow-sm"
          >
            <img
              src={p.image}
              alt={t(p.titleKey)}
              className={`h-40 w-full object-cover ${p.accent}`}
            />
            <div className="p-6">
              <h2 className="text-lg font-semibold text-stone-900">
                {t(p.titleKey)}
              </h2>
              <p className="mt-2 text-sm text-stone-600">{t(p.textKey)}</p>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
