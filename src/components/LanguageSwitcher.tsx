"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, localeNames, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function onSwitch(next: string) {
    router.replace(pathname, { locale: next as Locale });
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        onChange={(e) => onSwitch(e.target.value)}
        className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-brick-400"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
