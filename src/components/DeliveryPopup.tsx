import { useTranslations } from "next-intl";
import type { Delivery } from "@/lib/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

export function DeliveryPopup({ d }: { d: Delivery }) {
  const t = useTranslations("Deliveries");

  if (d.isGovernment) {
    return (
      <div className="w-60">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
          ★ {t("govBadge")}
        </div>
        <h3 className="text-base font-bold text-amber-900">{d.customerName}</h3>
        <dl className="mt-2 space-y-1 text-sm text-amber-900/80">
          <Row label={t("projectType")} value={d.projectType} />
          <Row label={t("products")} value={d.products.join(", ")} />
          <Row label={t("quantity")} value={d.quantity.toLocaleString()} />
          <Row label={t("date")} value={formatDate(d.deliveryDate)} />
          <Row label={t("purpose")} value={d.purpose} />
          <Row label={t("customer")} value={d.city} />
        </dl>
      </div>
    );
  }

  return (
    <div className="w-56">
      <h3 className="text-base font-semibold text-stone-900">{d.customerName}</h3>
      <dl className="mt-2 space-y-1 text-sm text-stone-600">
        <Row label={t("projectType")} value={d.projectType} />
        <Row label={t("products")} value={d.products.join(", ")} />
        <Row label={t("quantity")} value={d.quantity.toLocaleString()} />
        <Row label={t("date")} value={formatDate(d.deliveryDate)} />
        <Row label={t("purpose")} value={d.purpose} />
        <Row label={t("customer")} value={d.city} />
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="font-medium">{label}:</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
