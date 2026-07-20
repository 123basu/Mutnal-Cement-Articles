"use client";

import { useEffect, useState } from "react";
import type { Delivery } from "@/lib/types";

type Row = Delivery & { _isNew?: boolean };

const EMPTY: Delivery = {
  id: "",
  customerName: "",
  projectType: "",
  products: [],
  quantity: 0,
  deliveryDate: "",
  purpose: "",
  isGovernment: false,
  lat: 0,
  lng: 0,
  city: "",
};

export function DeliveryForm() {
  const [rows, setRows] = useState<Row[]>([]);
  const [sha, setSha] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/deliveries");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load");
      setLoading(false);
      return;
    }
    setRows(data.deliveries);
    setSha(data.sha);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function update(id: string, patch: Partial<Delivery>) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  }

  function addRow() {
    const id = `d-${Date.now()}`;
    setRows((prev) => [
      { ...EMPTY, id, _isNew: true, products: [], isGovernment: false },
      ...prev,
    ]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  async function save() {
    setStatus("");
    setError("");
    const payload = rows.map(({ _isNew, ...r }) => r);
    const res = await fetch("/api/admin/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveries: payload, sha }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("Saved. Redeploying…");
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
          + Add Delivery
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
              Customer
              <input
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.customerName}
                onChange={(e) => update(r.id, { customerName: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Project Type
              <input
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.projectType}
                onChange={(e) => update(r.id, { projectType: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Products (comma separated)
              <input
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.products.join(", ")}
                onChange={(e) =>
                  update(r.id, {
                    products: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
            <label className="text-sm">
              Quantity
              <input
                type="number"
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.quantity}
                onChange={(e) =>
                  update(r.id, { quantity: Number(e.target.value) })
                }
              />
            </label>
            <label className="text-sm">
              Delivery Date
              <input
                type="date"
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.deliveryDate}
                onChange={(e) => update(r.id, { deliveryDate: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Purpose
              <input
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.purpose}
                onChange={(e) => update(r.id, { purpose: e.target.value })}
              />
            </label>
            <label className="text-sm">
              City
              <input
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.city}
                onChange={(e) => update(r.id, { city: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Latitude
              <input
                type="number"
                step="0.0001"
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.lat}
                onChange={(e) => update(r.id, { lat: Number(e.target.value) })}
              />
            </label>
            <label className="text-sm">
              Longitude
              <input
                type="number"
                step="0.0001"
                className="mt-1 w-full rounded border border-stone-300 px-2 py-1"
                value={r.lng}
                onChange={(e) => update(r.id, { lng: Number(e.target.value) })}
              />
            </label>
            <label className="flex items-end gap-2 text-sm">
              <input
                type="checkbox"
                checked={r.isGovernment}
                onChange={(e) =>
                  update(r.id, { isGovernment: e.target.checked })
                }
              />
              Government project
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
