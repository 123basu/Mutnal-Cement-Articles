"use client";

import { useEffect, useState } from "react";
import type { ContactMessage } from "@/lib/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/contacts");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load");
      setLoading(false);
      return;
    }
    setMessages(data.contacts);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    setError("");
    const res = await fetch(`/api/admin/contacts?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } else {
      const data = await res.json();
      setError(data.error || "Delete failed");
    }
  }

  if (loading) return <p className="text-stone-500">Loading…</p>;

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {messages.length === 0 ? (
        <p className="text-stone-500">No messages yet.</p>
      ) : (
        messages.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-sm font-semibold text-stone-900">{m.name}</p>
                <p className="text-sm text-stone-600">
                  <a href={`mailto:${m.email}`} className="hover:text-brick-600">
                    {m.email}
                  </a>
                  {" · "}
                  <a href={`tel:${m.phone}`} className="hover:text-brick-600">
                    {m.phone}
                  </a>
                </p>
                <p className="text-sm text-stone-700 whitespace-pre-wrap">
                  {m.message}
                </p>
                <p className="text-xs text-stone-400">
                  {formatDate(m.submittedAt)}
                </p>
              </div>
              <button
                onClick={() => remove(m.id)}
                className="shrink-0 rounded-full bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
