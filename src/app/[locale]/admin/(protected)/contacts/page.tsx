import { ContactMessages } from "@/components/admin/ContactMessages";

export default function AdminContactsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-stone-900">Contact Messages</h2>
      <p className="mt-1 text-sm text-stone-600">
        Messages submitted through the public contact form.
      </p>
      <div className="mt-6">
        <ContactMessages />
      </div>
    </div>
  );
}
