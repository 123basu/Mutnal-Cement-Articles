"use client";

import { useEffect, useState, useRef } from "react";
import type { AdminProduct } from "@/lib/types";

type Row = AdminProduct & { _isNew?: boolean };

const EMPTY: Omit<AdminProduct, "id"> = {
  name: "",
  description: "",
  specs: [],
  image: "",
};

export function ProductForm() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUploadId, setPendingUploadId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load");
      setLoading(false);
      return;
    }
    setRows(data.products);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function update(id: string, patch: Partial<AdminProduct>) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  }

  function addRow() {
    const id = `p-${Date.now()}`;
    setRows((prev) => [{ ...EMPTY, id, _isNew: true, specs: [] }, ...prev]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function triggerUpload(id: string) {
    setPendingUploadId(id);
    fileInputRef.current?.click();
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !pendingUploadId) return;
    setUploadingId(pendingUploadId);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      update(pendingUploadId, { image: data.url });
    } else {
      setError(data.error || "Upload failed");
    }
    setUploadingId(null);
    setPendingUploadId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function save() {
    setStatus("");
    setError("");
    const payload = rows.map(({ _isNew, ...r }) => r);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: payload }),
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileSelected}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={addRow}
          className="rounded-full bg-brick-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brick-600"
        >
          + Add Product
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
              Product Name
              <input
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.name}
                onChange={(e) => update(r.id, { name: e.target.value })}
              />
            </label>
            <label className="text-sm md:col-span-2">
              Description
              <input
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.description}
                onChange={(e) => update(r.id, { description: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Key Specs (comma separated)
              <input
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.specs.join(", ")}
                onChange={(e) =>
                  update(r.id, {
                    specs: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
            <div className="flex items-end gap-2">
              <button
                onClick={() => triggerUpload(r.id)}
                disabled={uploadingId === r.id}
                className="rounded-full bg-stone-500 px-3 py-1 text-sm text-white hover:bg-stone-600 disabled:opacity-50"
              >
                {uploadingId === r.id ? "Uploading…" : r.image ? "Change Image" : "Upload Image"}
              </button>
              {r.image && (
                <img
                  src={r.image}
                  alt=""
                  className="h-10 w-10 rounded object-cover"
                />
              )}
            </div>
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
