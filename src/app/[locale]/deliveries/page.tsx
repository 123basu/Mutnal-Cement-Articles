import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import deliveriesData from "@/data/deliveries.json";
import type { Delivery } from "@/lib/types";
import DeliveryMapLoader from "@/components/DeliveryMapLoader";

export default async function DeliveriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Deliveries");

  const deliveries = deliveriesData.deliveries as Delivery[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold text-stone-900">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-600">{t("intro")}</p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-brick-500" />
          {t("legendRegular")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-500" />
          {t("legendGov")}
        </span>
      </div>

      <div className="mt-6 h-[70vh] overflow-hidden rounded-2xl border border-stone-200 shadow-sm">
        <DeliveryMapLoader deliveries={deliveries} />
      </div>
    </div>
  );
}
