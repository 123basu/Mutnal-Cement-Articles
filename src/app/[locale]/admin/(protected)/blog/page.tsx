import { BlogForm } from "@/components/admin/BlogForm";

export default function AdminBlogPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-stone-900">Manage Blogs</h2>
      <p className="mt-1 text-sm text-stone-600">
        Add, edit or remove blog posts shown on the public Blog page.
      </p>
      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
