import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");

  const links = [
    { href: "/", label: nav("home") },
    { href: "/about", label: nav("about") },
    { href: "/products", label: nav("products") },
    { href: "/deliveries", label: nav("deliveries") },
    { href: "/blog", label: nav("blog") },
    { href: "/contact", label: nav("contact") },
  ] as const;

  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-white">
            <img
              src="/logo.png"
              alt="Mutnal Cement Articles"
              className="h-8 w-auto"
            />
            Mutnal Cement Articles
          </div>
          <p className="mt-3 max-w-xs text-sm">{t("tagline")}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{t("quickLinks")}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brick-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{t("contactTitle")}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>ravindramutnal@gmail.com</li>
            <li>+91 8792856852</li>
            <li>469/10, NH4, near IOC Petrol Pump, M K Hubli, Karnataka 591118</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Mutnal Cemenmt Articles. {t("rights")}
      </div>
    </footer>
  );
}
