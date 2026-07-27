import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function ProtectedAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const store = await cookies();
  const authed = verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!authed) {
    redirect({ href: "/admin/login", locale });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-stone-900">Admin Panel</h1>
      </div>

      <AdminNav />

      {children}
    </div>
  );
}
