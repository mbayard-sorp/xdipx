"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function EmailSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/klaviyo/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-brand-mist py-16">
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
        <div className="text-3xl mb-3">♥</div>
        <h2 className="font-headline font-black text-2xl md:text-3xl text-brand-charcoal mb-3">
          Get tomorrow&apos;s deal before it drops.
        </h2>
        <p className="text-brand-charcoal/60 mb-8">
          No spam. Just good stuff.
        </p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 card-shadow"
            >
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-headline font-bold text-brand-charcoal text-lg">
                You&apos;re in! ♥
              </p>
              <p className="text-brand-charcoal/60 text-sm mt-1">
                Tomorrow&apos;s deal will land in your inbox before midnight.
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-5 py-4 rounded-2xl border border-brand-purple/20 bg-white text-brand-charcoal placeholder-brand-charcoal/30 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-base"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-gradient px-8 py-4 rounded-2xl font-headline font-bold text-white text-base whitespace-nowrap shadow-lg disabled:opacity-60"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Joining...
                  </span>
                ) : (
                  "I&apos;m In ♥"
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {status === "error" && (
          <p className="text-red-500 text-sm mt-3">
            Something went wrong. Try again?
          </p>
        )}

        <p className="text-brand-charcoal/30 text-xs mt-5">
          We&apos;ll never share your email. Ever. Pinky swear.
        </p>
      </div>
    </section>
  );
}
