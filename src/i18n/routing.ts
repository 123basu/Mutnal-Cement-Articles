import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "kn", "hi"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  kn: "ಕನ್ನಡ",
  hi: "हिन्दी",
};
