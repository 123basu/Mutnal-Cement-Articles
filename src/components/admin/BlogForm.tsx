"use client";

import { useEffect, useState } from "react";
import type { AdminBlog } from "@/lib/types";

type Row = AdminBlog & { _isNew?: boolean };

const EMPTY: Omit<AdminBlog, "id" | "slug"> = {
  category: "",
  title: "",
  description: "",
  author: "",
  date: "",
  readingTime: 0,
  content: "",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function BlogForm() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/blogs");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load");
      setLoading(false);
      return;
    }
    setRows(data.blogs);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function update(id: string, patch: Partial<AdminBlog>) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  }

  function addRow() {
    const id = `b-${Date.now()}`;
    setRows((prev) => [
      { ...EMPTY, id, slug: "", _isNew: true, readingTime: 0 },
      ...prev,
    ]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  async function save() {
    setStatus("");
    setError("");
    const payload = rows.map(({ _isNew, ...r }) => {
      if (!r.slug && r.title) {
        r.slug = slugify(r.title);
      }
      return r;
    });
    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blogs: payload }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("Saved");
      await load();
    } else {
      setError(data.error || "Save failed");
    }
  }

  if (loading) return <p className="text-stone-500">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={addRow}
          className="rounded-full bg-brick-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brick-600"
        >
          + Add Blog
        </button>
        <button
          onClick={save}
          className="rounded-full border border-brick-500 px-4 py-2 text-sm font-semibold text-brick-600 hover:bg-brick-50"
        >
          Save Changes
        </button>
        {status && <span className="text-sm text-green-600">{status}</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      <div className="space-y-4">
        {rows.map((r) => (
          <div
            key={r.id}
            className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-4"
          >
            <label className="text-sm">
              Category
              <input
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.category}
                onChange={(e) => update(r.id, { category: e.target.value })}
              />
            </label>
            <label className="text-sm md:col-span-2">
              Title
              <input
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.title}
                onChange={(e) => update(r.id, { title: e.target.value })}
              />
            </label>
            <label className="text-sm md:col-span-3">
              Description
              <input
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.description}
                onChange={(e) => update(r.id, { description: e.target.value })}
              />
            </label>
            <label className="text-sm md:col-span-4">
              Content (Markdown supported)
              <textarea
                rows={4}
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1 font-mono text-xs"
                value={r.content}
                onChange={(e) => update(r.id, { content: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Team / Author
              <input
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.author}
                onChange={(e) => update(r.id, { author: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Date
              <input
                type="date"
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.date}
                onChange={(e) => update(r.id, { date: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Reading Time (min)
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.readingTime}
                onChange={(e) =>
                  update(r.id, { readingTime: Number(e.target.value) })
                }
              />
            </label>
            <div className="flex items-end">
              <button
                onClick={() => removeRow(r.id)}
                className="rounded-full bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
