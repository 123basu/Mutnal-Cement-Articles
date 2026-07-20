"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function AdminLogin() {
  const t = useTranslations("Nav");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid password");
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-24">
      <h1 className="text-2xl font-bold text-stone-900">Admin Login</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-brick-500 focus:outline-none focus:ring-2 focus:ring-brick-200"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brick-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-brick-600 disabled:opacity-50"
        >
          {loading ? "…" : "Login"}
        </button>
      </form>
    </div>
  );
}
