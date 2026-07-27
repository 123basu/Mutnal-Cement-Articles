"use client";

import { Link, usePathname } from "@/i18n/navigation";

const ADMIN_TABS = [
  { href: "/admin", label: "Deliveries" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/contacts", label: "Contact Messages" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <nav className="mb-8 flex gap-1 rounded-xl border border-stone-200 bg-white p-1 shadow-sm">
      {ADMIN_TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isActive(tab.href)
              ? "bg-brick-500 text-white"
              : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
