"use client";

import dynamic from "next/dynamic";
import type { Delivery } from "@/lib/types";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-stone-100 text-stone-500">
      Loading map…
    </div>
  ),
});

export default function DeliveryMapLoader({
  deliveries,
}: {
  deliveries: Delivery[];
}) {
  return <DeliveryMap deliveries={deliveries} />;
}
