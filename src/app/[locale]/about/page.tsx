import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  const stats = [
    { value: "18+", label: t("statsYears") },
    { value: "50k", label: t("statsTonnes") },
    { value: "25+", label: t("statsCities") },
    { value: "40+", label: t("statsGov") },
  ];

  const values = [
    { title: t("value1Title"), text: t("value1Text") },
    { title: t("value2Title"), text: t("value2Text") },
    { title: t("value3Title"), text: t("value3Text") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-stone-900">{t("title")}</h1>
      <p className="mt-4 text-lg text-stone-600">{t("intro")}</p>

      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm"
          >
            <div className="text-3xl font-bold text-brick-600">{s.value}</div>
            <div className="mt-2 text-sm text-stone-500">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-stone-900">{t("missionTitle")}</h2>
        <p className="mt-3 text-stone-600">{t("missionText")}</p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-stone-900">{t("valuesTitle")}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-brick-600">{v.title}</h3>
              <p className="mt-2 text-sm text-stone-600">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
