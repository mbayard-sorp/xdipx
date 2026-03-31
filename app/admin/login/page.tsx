"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong password. Try again.");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-headline font-black text-3xl text-gradient">xdipx</div>
          <p className="text-brand-charcoal/50 text-sm mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-brand-purple/20 rounded-xl px-4 py-3 outline-none focus:border-brand-purple text-brand-charcoal"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="btn-gradient w-full py-3 rounded-xl font-bold text-white"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
