import { ProductForm } from "@/components/admin/ProductForm";

export default function AdminProductsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-stone-900">Manage Products</h2>
      <p className="mt-1 text-sm text-stone-600">
        Add, edit or remove products shown on the public Products page.
      </p>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
