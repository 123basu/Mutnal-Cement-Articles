import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

const messageLoaders: Record<
  (typeof routing.locales)[number],
  () => Promise<{ default: unknown }>
> = {
  en: () => import("../messages/en.json"),
  kn: () => import("../messages/kn.json"),
  hi: () => import("../messages/hi.json"),
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = (await messageLoaders[locale]()).default;

  return {
    locale,
    messages: messages as Record<string, string>,
  };
});
