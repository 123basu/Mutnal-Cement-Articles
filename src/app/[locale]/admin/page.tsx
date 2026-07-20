import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { DeliveryForm } from "@/components/admin/DeliveryForm";

export default async function AdminPage({
  params,
}: {
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
      <h1 className="text-3xl font-bold text-stone-900">Manage Deliveries</h1>
      <p className="mt-2 text-stone-600">
        Edits are saved to the repository and trigger a redeploy.
      </p>
      <div className="mt-8">
        <DeliveryForm />
      </div>
    </div>
  );
}
