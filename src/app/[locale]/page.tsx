import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await import("next-intl/server").then((m) => m.getTranslations("Home"));

  const usps = [
    { title: t("usp1Title"), text: t("usp1Text") },
    { title: t("usp2Title"), text: t("usp2Text") },
    { title: t("usp3Title"), text: t("usp3Text") },
    { title: t("usp4Title"), text: t("usp4Text") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-brick-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 md:py-32">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brick-300">
            Mutnal Cement Articles
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-stone-200">
            {t("heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-brick-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-brick-600"
            >
              {t("ctaQuote")}
            </Link>
            <Link
              href="/deliveries"
              className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t("ctaDeliveries")}
            </Link>
          </div>
        </div>
      </section>

      {/* USP */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-bold text-stone-900 md:text-3xl">
          {t("uspTitle")}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((u) => (
            <div
              key={u.title}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-brick-600">{u.title}</h3>
              <p className="mt-2 text-sm text-stone-600">{u.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products teaser */}
      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-stone-900 md:text-3xl">
              {t("featuredProducts")}
            </h2>
            <Link
              href="/products"
              className="text-sm font-semibold text-brick-600 hover:underline"
            >
              {t("viewAllProducts")}
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Solid Brick 9x4x3", image: "/block_size_1.webp" },
              { name: "Solid Brick 8x4x3", image: "/block_size_2.webp" },
            ].map((p) => (
              <div
                key={p.name}
                className="overflow-hidden rounded-2xl bg-white text-center shadow-sm"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4 text-lg font-semibold text-stone-700">
                  {p.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliveries teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl bg-brick-50 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-stone-900 md:text-3xl">
            {t("deliveriesTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-stone-600">{t("deliveriesText")}</p>
          <Link
            href="/deliveries"
            className="mt-6 inline-block rounded-full bg-brick-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-brick-600"
          >
            {t("ctaDeliveries")}
          </Link>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-stone-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold">{t("ctaBandTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">{t("ctaBandText")}</p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-brick-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-brick-600"
          >
            {t("ctaQuote")}
          </Link>
        </div>
      </section>
    </div>
  );
}
