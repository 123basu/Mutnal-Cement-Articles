import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/ContactForm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-stone-900">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-600">{t("intro")}</p>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <ContactForm />

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">
            {t("addressTitle")}
          </h2>
          <ul className="mt-4 space-y-3 text-stone-600">
            <li>
              <span className="font-medium text-stone-700">
                {t("addressTitle")}:
              </span>{" "}
              469/10, NH4, near IOC Petrol Pump, M K Hubli, Karnataka 591118
            </li>
            <li>
              <span className="font-medium text-stone-700">
                {t("phoneLabel")}:
              </span>{" "}
              +91 8792856852
            </li>
            <li>
              <span className="font-medium text-stone-700">
                {t("emailLabel")}:
              </span>{" "}
              ravindramutnal@gmail.com
            </li>
          </ul>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=15.713794,74.700944"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-brick-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-brick-600"
          >
            {t("locateUs")}
          </a>
        </div>
      </div>
    </div>
  );
}
