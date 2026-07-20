"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/products", label: t("products") },
    { href: "/deliveries", label: t("deliveries") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-stone-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-brick-600">
          <img
            src="/logo.png"
            alt="Mutnal Cement Articles"
            className="h-8 w-auto"
          />
          <span className="text-stone-900">Mutnal Cement Articles</span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`text-sm font-medium transition-colors hover:text-brick-600 ${
                    active ? "text-brick-600" : "text-stone-600"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="hidden rounded-full bg-brick-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brick-600 md:inline-block"
          >
            {t("contact")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
