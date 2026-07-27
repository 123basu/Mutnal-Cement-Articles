"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrors([]);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    });

    setLoading(false);

    if (res.ok) {
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } else {
      const data = await res.json();
      setErrors(data.errors || [data.error || "Something went wrong"]);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700">
          {t("name")}
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">
          {t("email")}
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">
          {t("phone")}
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">
          {t("message")}
        </label>
        <textarea
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-200"
        />
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errors.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}

      {status === "success" && (
        <p className="text-sm text-green-700">{t("success")}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-brick-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-brick-600 disabled:opacity-50"
      >
        {loading ? "…" : t("send")}
      </button>
    </form>
  );
}
