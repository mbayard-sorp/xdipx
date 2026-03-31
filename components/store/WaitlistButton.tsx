"use client";

import { useState } from "react";

interface WaitlistButtonProps {
  productId: string;
  productHandle: string;
}

export function WaitlistButton({ productId, productHandle }: WaitlistButtonProps) {
  const [step, setStep] = useState<"idle" | "input" | "done">("idle");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/klaviyo/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId, productHandle }),
      });
      setStep("done");
    } finally {
      setLoading(false);
    }
  }

  if (step === "done") {
    return <p className="text-sm text-green-600 font-medium">You&apos;re on the list ♥</p>;
  }

  if (step === "input") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 text-sm border border-brand-purple/20 rounded-xl px-4 py-2.5 outline-none focus:border-brand-purple"
          required
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-gradient text-white text-sm font-bold px-4 py-2.5 rounded-xl disabled:opacity-50"
        >
          {loading ? "..." : "♥"}
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => setStep("input")}
      className="text-sm font-medium text-brand-purple hover:text-brand-purple-light transition-colors underline underline-offset-2"
    >
      Notify me when it&apos;s back →
    </button>
  );
}
