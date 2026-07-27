import { DeliveryForm } from "@/components/admin/DeliveryForm";

export default function AdminDeliveriesPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-stone-900">Manage Deliveries</h2>
      <p className="mt-1 text-sm text-stone-600">
        Edits are saved to the repository and trigger a redeploy.
      </p>
      <div className="mt-6">
        <DeliveryForm />
      </div>
    </div>
  );
}
